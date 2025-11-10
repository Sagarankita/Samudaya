from flask import Flask, request, jsonify
from flask_cors import CORS
from pymongo import MongoClient
import certifi
from bson import ObjectId
from datetime import datetime
from werkzeug.security import generate_password_hash, check_password_hash
import os
from dotenv import load_dotenv
import secrets
from datetime import timedelta

load_dotenv()

app = Flask(__name__)
CORS(app)

# MongoDB Connection
MONGO_URI = os.getenv('MONGO_URI', 'mongodb://localhost:27017/')
if not MONGO_URI or MONGO_URI == 'mongodb://localhost:27017/':
    print("⚠️  WARNING: MONGO_URI not set in .env file. Using default localhost.")
    print("   Please create a .env file in the backend folder with:")
    print("   MONGO_URI=mongodb+srv://tulipankitaa_db:Ankita%4026@samudaya.quesitv.mongodb.net/?appName=Samudaya")
else:
    # Mask password in logs
    masked_uri = MONGO_URI.split('@')[0].split(':')[0] + ':***@' + '@'.join(MONGO_URI.split('@')[1:]) if '@' in MONGO_URI else MONGO_URI
    print(f"✅ Connecting to MongoDB Atlas: {masked_uri[:80]}...")

try:
    tls_insecure = os.getenv('MONGO_TLS_INSECURE', 'false').lower() == 'true'
    client_kwargs = dict(
        serverSelectionTimeoutMS=5000,
        tlsCAFile=certifi.where(),
    )
    if tls_insecure:
        # Debug-only: allow insecure TLS to bypass corporate SSL inspection
        client_kwargs.update({
            'tlsAllowInvalidCertificates': True,
            'tlsInsecure': True,
        })

    client = MongoClient(
        MONGO_URI,
        **client_kwargs,
    )
    # Test connection
    client.admin.command('ping')
    print("✅ MongoDB Atlas connection successful!")
except Exception as e:
    print(f"❌ MongoDB connection failed: {e}")
    print("   Please check your .env file and connection string.")
    raise

db = client['samudaya_events']

# Collections
users = db['users']
events = db['events']
announcements = db['announcements']
forum_threads = db['forum_threads']
volunteers = db['volunteers']

# Helper function to serialize MongoDB documents
def serialize_doc(doc):
    if doc and '_id' in doc:
        doc['_id'] = str(doc['_id'])
    return doc

# ==================== AUTH ROUTES ====================

@app.route('/api/auth/login', methods=['POST'])
def login():
    try:
        data = request.json
        email = data.get('email')
        password = data.get('password')
        
        print(f"Login attempt for: {email}")  # Debug log
        
        user = users.find_one({'email': email})
        
        if not user:
            print(f"User not found: {email}")  # Debug log
            return jsonify({'success': False, 'message': 'User not found'}), 401
        
        print(f"User found: {user.get('name')}, Role: {user.get('role')}")  # Debug log
        
        # Check password
        if check_password_hash(user['password'], password):
            print("Password correct!")  # Debug log
            return jsonify({
                'success': True,
                'user': {
                    'id': str(user['_id']),
                    'name': user['name'],
                    'email': user['email'],
                    'role': user['role']
                }
            })
        else:
            print("Password incorrect!")  # Debug log
            return jsonify({'success': False, 'message': 'Invalid password'}), 401
    
    except Exception as e:
        print(f"Login error: {str(e)}")  # Debug log
        return jsonify({'success': False, 'message': str(e)}), 500

@app.route('/api/auth/register', methods=['POST'])
def register():
    try:
        data = request.json
        
        if users.find_one({'email': data.get('email')}):
            return jsonify({'success': False, 'message': 'Email already exists'}), 400
        
        user_data = {
            'name': data.get('name'),
            'email': data.get('email'),
            'password': generate_password_hash(data.get('password')),
            'role': 'member',
            'joinDate': datetime.now().isoformat(),
            'eventsCreated': 0,
            'volunteerHours': 0,
            'status': 'active'
        }
        
        result = users.insert_one(user_data)
        
        return jsonify({
            'success': True,
            'user': {
                'id': str(result.inserted_id),
                'name': user_data['name'],
                'email': user_data['email'],
                'role': user_data['role']
            }
        })
    except Exception as e:
        print(f"Registration error: {str(e)}")
        return jsonify({'success': False, 'message': str(e)}), 500

@app.route('/api/auth/forgot-password', methods=['POST'])
def forgot_password():
    try:
        data = request.json
        email = data.get('email')
        if not email:
            return jsonify({'success': False, 'message': 'Email is required'}), 400

        user = users.find_one({'email': email})
        # Always respond success to avoid email enumeration
        if not user:
            return jsonify({'success': True})

        reset_token = secrets.token_urlsafe(32)
        expires_at = (datetime.utcnow() + timedelta(minutes=30)).isoformat()

        users.update_one(
            {'_id': user['_id']},
            {'$set': {'passwordReset': {'token': reset_token, 'expiresAt': expires_at}}}
        )

        # In real app, send email with reset link. For now, return token for dev.
        return jsonify({'success': True, 'token': reset_token})
    except Exception as e:
        print(f"Forgot password error: {str(e)}")
        return jsonify({'success': False, 'message': str(e)}), 500

@app.route('/api/auth/reset-password', methods=['POST'])
def reset_password():
    try:
        data = request.json
        token = data.get('token')
        new_password = data.get('password')
        if not token or not new_password:
            return jsonify({'success': False, 'message': 'Token and password are required'}), 400

        user = users.find_one({'passwordReset.token': token})
        if not user:
            return jsonify({'success': False, 'message': 'Invalid token'}), 400

        # Validate expiry
        expires_at_str = user.get('passwordReset', {}).get('expiresAt')
        try:
            expires_at = datetime.fromisoformat(expires_at_str)
        except Exception:
            return jsonify({'success': False, 'message': 'Invalid token'}), 400

        if datetime.utcnow() > expires_at:
            return jsonify({'success': False, 'message': 'Token expired'}), 400

        users.update_one(
            {'_id': user['_id']},
            {
                '$set': {'password': generate_password_hash(new_password)},
                '$unset': {'passwordReset': ''}
            }
        )

        return jsonify({'success': True})
    except Exception as e:
        print(f"Reset password error: {str(e)}")
        return jsonify({'success': False, 'message': str(e)}), 500

# ==================== USER ROUTES ====================

@app.route('/api/users', methods=['GET'])
def get_users():
    all_users = list(users.find())
    return jsonify([serialize_doc(user) for user in all_users])

@app.route('/api/users/<user_id>', methods=['GET'])
def get_user(user_id):
    user = users.find_one({'_id': ObjectId(user_id)})
    if user:
        return jsonify(serialize_doc(user))
    return jsonify({'error': 'User not found'}), 404

@app.route('/api/users/<user_id>', methods=['PUT'])
def update_user(user_id):
    data = request.json
    update_data = {}
    
    # Handle password update separately
    if 'password' in data:
        update_data['password'] = generate_password_hash(data['password'])
    else:
        # Update other fields
        allowed_fields = ['name', 'email', 'bio', 'role', 'status', 'emailPreferences']
        for field in allowed_fields:
            if field in data:
                update_data[field] = data[field]
    
    if not update_data:
        return jsonify({'error': 'No valid fields to update'}), 400
    
    result = users.update_one(
        {'_id': ObjectId(user_id)},
        {'$set': update_data}
    )
    
    if result.matched_count:
        return jsonify({'success': True})
    return jsonify({'error': 'User not found'}), 404

# ==================== EVENT ROUTES ====================

@app.route('/api/events', methods=['GET'])
def get_events():
    user_id = request.args.get('userId')
    all_events = list(events.find({'status': {'$in': ['published', 'pending']}}))
    
    # If userId provided, check registration status for each event
    if user_id:
        for event in all_events:
            if 'registeredUsers' in event and user_id in event['registeredUsers']:
                event['isRegistered'] = True
            else:
                event['isRegistered'] = False
    
    return jsonify([serialize_doc(event) for event in all_events])

@app.route('/api/events/<event_id>', methods=['GET'])
def get_event(event_id):
    event = events.find_one({'_id': ObjectId(event_id)})
    if event:
        return jsonify(serialize_doc(event))
    return jsonify({'error': 'Event not found'}), 404

@app.route('/api/events', methods=['POST'])
def create_event():
    data = request.json
    
    event_data = {
        'title': data.get('title'),
        'description': data.get('description'),
        'date': data.get('date'),
        'time': data.get('time'),
        'location': data.get('location'),
        'category': data.get('category'),
        'capacity': data.get('capacity'),
        'registered': 0,
        'registeredUsers': [],
        'imageUrl': data.get('imageUrl', ''),
        'creator': data.get('creator'),
        'status': 'pending' if data.get('status') == 'published' else data.get('status', 'draft'),
        'tags': data.get('tags', []),
        'createdAt': datetime.now().isoformat()
    }
    
    result = events.insert_one(event_data)
    
    # Update user's events created count
    users.update_one(
        {'_id': ObjectId(data.get('creator'))},
        {'$inc': {'eventsCreated': 1}}
    )
    
    return jsonify({
        'success': True,
        'eventId': str(result.inserted_id)
    })

@app.route('/api/events/<event_id>', methods=['PUT'])
def update_event(event_id):
    data = request.json
    result = events.update_one(
        {'_id': ObjectId(event_id)},
        {'$set': data}
    )
    
    if result.modified_count:
        return jsonify({'success': True})
    return jsonify({'error': 'Event not found'}), 404

@app.route('/api/events/<event_id>', methods=['DELETE'])
def delete_event(event_id):
    result = events.delete_one({'_id': ObjectId(event_id)})
    
    if result.deleted_count:
        return jsonify({'success': True})
    return jsonify({'error': 'Event not found'}), 404

@app.route('/api/events/<event_id>/register', methods=['POST'])
def register_for_event(event_id):
    data = request.json
    user_id = data.get('userId')
    
    event = events.find_one({'_id': ObjectId(event_id)})
    
    if not event:
        return jsonify({'error': 'Event not found'}), 404
    
    # Initialize registeredUsers array if it doesn't exist
    registered_users = event.get('registeredUsers', [])
    
    # Check if user is already registered
    if user_id in registered_users:
        return jsonify({'error': 'Already registered for this event'}), 400
    
    if len(registered_users) >= event['capacity']:
        return jsonify({'error': 'Event is full'}), 400
    
    # Add user to registeredUsers and update count
    events.update_one(
        {'_id': ObjectId(event_id)},
        {
            '$push': {'registeredUsers': user_id},
            '$inc': {'registered': 1}
        }
    )
    
    return jsonify({'success': True})

# ==================== ANNOUNCEMENT ROUTES ====================

@app.route('/api/announcements', methods=['GET'])
def get_announcements():
    all_announcements = list(announcements.find().sort('date', -1))
    return jsonify([serialize_doc(ann) for ann in all_announcements])

@app.route('/api/announcements', methods=['POST'])
def create_announcement():
    data = request.json
    
    announcement_data = {
        'title': data.get('title'),
        'content': data.get('content'),
        'type': data.get('type'),
        'author': data.get('author'),
        'date': datetime.now().isoformat(),
        'expiresOn': data.get('expiresOn')
    }
    
    result = announcements.insert_one(announcement_data)
    
    return jsonify({
        'success': True,
        'announcementId': str(result.inserted_id)
    })

@app.route('/api/announcements/<announcement_id>', methods=['DELETE'])
def delete_announcement(announcement_id):
    result = announcements.delete_one({'_id': ObjectId(announcement_id)})
    
    if result.deleted_count:
        return jsonify({'success': True})
    return jsonify({'error': 'Announcement not found'}), 404

# ==================== FORUM ROUTES ====================

@app.route('/api/forum/threads', methods=['GET'])
def get_forum_threads():
    all_threads = list(forum_threads.find().sort('createdAt', -1))
    return jsonify([serialize_doc(thread) for thread in all_threads])

@app.route('/api/forum/threads', methods=['POST'])
def create_forum_thread():
    data = request.json
    
    thread_data = {
        'title': data.get('title'),
        'author': data.get('author'),
        'category': data.get('category'),
        'replies': 0,
        'likes': 0,
        'tags': data.get('tags', []),
        'isPinned': False,
        'flags': 0,
        'createdAt': datetime.now().isoformat(),
        'lastActivity': datetime.now().isoformat()
    }
    
    result = forum_threads.insert_one(thread_data)
    
    return jsonify({
        'success': True,
        'threadId': str(result.inserted_id)
    })

@app.route('/api/forum/threads/<thread_id>', methods=['DELETE'])
def delete_forum_thread(thread_id):
    result = forum_threads.delete_one({'_id': ObjectId(thread_id)})
    
    if result.deleted_count:
        return jsonify({'success': True})
    return jsonify({'error': 'Thread not found'}), 404

@app.route('/api/forum/threads/<thread_id>/pin', methods=['PUT'])
def pin_forum_thread(thread_id):
    result = forum_threads.update_one(
        {'_id': ObjectId(thread_id)},
        {'$set': {'isPinned': True}}
    )
    
    if result.modified_count:
        return jsonify({'success': True})
    return jsonify({'error': 'Thread not found'}), 404

# ==================== VOLUNTEER ROUTES ====================

@app.route('/api/volunteers', methods=['GET'])
def get_volunteers():
    all_volunteers = list(volunteers.find())
    return jsonify([serialize_doc(vol) for vol in all_volunteers])

@app.route('/api/volunteers', methods=['POST'])
def register_volunteer():
    data = request.json
    user_id = data.get('userId')
    event_id = data.get('eventId')
    
    # Check if user is already registered as volunteer for this event
    existing = volunteers.find_one({'userId': user_id, 'eventId': event_id})
    if existing:
        return jsonify({'error': 'Already registered as volunteer for this event'}), 400
    
    volunteer_data = {
        'userId': user_id,
        'eventId': event_id,
        'role': data.get('role', 'volunteer'),
        'hours': data.get('hours', 0),
        'status': data.get('status', 'upcoming'),
        'registeredAt': datetime.now().isoformat()
    }
    
    result = volunteers.insert_one(volunteer_data)
    
    # Update user's volunteer hours only if status is completed
    if volunteer_data['status'] == 'completed':
        users.update_one(
            {'_id': ObjectId(user_id)},
            {'$inc': {'volunteerHours': volunteer_data['hours']}}
        )
    
    return jsonify({
        'success': True,
        'volunteerId': str(result.inserted_id)
    })

@app.route('/api/volunteers/user/<user_id>', methods=['GET'])
def get_user_volunteer_history(user_id):
    user_volunteers = list(volunteers.find({'userId': user_id}))
    # Enrich with event details
    for vol in user_volunteers:
        if vol.get('eventId'):
            event = events.find_one({'_id': ObjectId(vol['eventId'])})
            if event:
                vol['event'] = event.get('title', 'Unknown Event')
                vol['date'] = event.get('date', '')
    return jsonify([serialize_doc(vol) for vol in user_volunteers])

@app.route('/api/volunteers/event/<event_id>', methods=['GET'])
def get_event_volunteers(event_id):
    event_volunteers = list(volunteers.find({'eventId': event_id}))
    # Enrich with user details
    for vol in event_volunteers:
        if vol.get('userId'):
            user = users.find_one({'_id': ObjectId(vol['userId'])})
            if user:
                vol['name'] = user.get('name', 'Unknown')
                vol['email'] = user.get('email', '')
    return jsonify([serialize_doc(vol) for vol in event_volunteers])

@app.route('/api/events/user/<user_id>', methods=['GET'])
def get_user_events(user_id):
    user_events = list(events.find({'creator': user_id}))
    return jsonify([serialize_doc(event) for event in user_events])

# ==================== ADMIN ROUTES ====================

@app.route('/api/admin/stats', methods=['GET'])
def get_admin_stats():
    total_users = users.count_documents({'status': 'active'})
    active_events = events.count_documents({'status': 'published'})
    total_volunteers = volunteers.count_documents({})
    forum_posts = forum_threads.count_documents({})
    
    # Get most popular events
    popular_events = list(events.find({'status': 'published'}).sort('registered', -1).limit(5))
    popular_events_data = [{'name': e['title'], 'attendees': e.get('registered', 0)} for e in popular_events]
    
    # Get user activity stats
    recent_users = users.count_documents({
        'joinDate': {'$gte': (datetime.now().replace(day=1) - timedelta(days=30)).isoformat()}
    })
    
    return jsonify({
        'totalUsers': total_users,
        'activeEvents': active_events,
        'totalVolunteers': total_volunteers,
        'forumPosts': forum_posts,
        'popularEvents': popular_events_data,
        'newUsers30Days': recent_users
    })

@app.route('/api/admin/events/pending', methods=['GET'])
def get_pending_events():
    # Get events with status 'pending' or 'draft' that need approval
    pending = list(events.find({'status': {'$in': ['pending', 'draft']}}))
    # Include creator name
    for event in pending:
        if event.get('creator'):
            creator = users.find_one({'_id': ObjectId(event['creator'])})
            if creator:
                event['creator'] = creator.get('name', 'Unknown')
    return jsonify([serialize_doc(event) for event in pending])

@app.route('/api/admin/events/<event_id>/approve', methods=['PUT'])
def approve_event(event_id):
    result = events.update_one(
        {'_id': ObjectId(event_id)},
        {'$set': {'status': 'published'}}
    )
    
    if result.modified_count:
        return jsonify({'success': True})
    return jsonify({'error': 'Event not found'}), 404

@app.route('/api/admin/events/<event_id>/reject', methods=['PUT'])
def reject_event(event_id):
    result = events.update_one(
        {'_id': ObjectId(event_id)},
        {'$set': {'status': 'rejected'}}
    )
    
    if result.modified_count:
        return jsonify({'success': True})
    return jsonify({'error': 'Event not found'}), 404

# ==================== TEST ROUTE ====================

@app.route('/api/test', methods=['GET'])
def test():
    return jsonify({
        'status': 'Backend is running!',
        'database': 'Connected to MongoDB',
        'users_count': users.count_documents({})
    })

if __name__ == '__main__':
    print("\n" + "="*50)
    print("🚀 Starting Samudaya Events Backend Server")
    print("="*50)
    
    # Test database connection
    try:
        db_users = users.count_documents({})
        print(f"✅ MongoDB Connected - {db_users} users in database")
        
        # Check if we have demo users
        demo_user = users.find_one({'email': 'rajesh@example.com'})
        admin_user = users.find_one({'email': 'admin@samudaya.com'})
        
        if not demo_user:
            print("⚠️  Demo user not found - run seed_database.py")
        else:
            print(f"✅ Demo user exists: {demo_user['email']}")
            
        if not admin_user:
            print("⚠️  Admin user not found - run seed_database.py")
        else:
            print(f"✅ Admin user exists: {admin_user['email']}")
            
    except Exception as e:
        print(f"❌ Database connection failed: {e}")
    
    print("="*50 + "\n")
    
    app.run(debug=True, port=5000)