from flask import Flask, request, jsonify
from flask_cors import CORS
from pymongo import MongoClient
from bson import ObjectId
from datetime import datetime
from werkzeug.security import generate_password_hash, check_password_hash
import os
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)
CORS(app)

# MongoDB Connection
MONGO_URI = os.getenv('MONGO_URI', 'mongodb://localhost:27017/')
client = MongoClient(MONGO_URI)
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
    data = request.json
    email = data.get('email')
    password = data.get('password')
    
    user = users.find_one({'email': email})
    
    if user and check_password_hash(user['password'], password):
        return jsonify({
            'success': True,
            'user': {
                'id': str(user['_id']),
                'name': user['name'],
                'email': user['email'],
                'role': user['role']
            }
        })
    
    return jsonify({'success': False, 'message': 'Invalid credentials'}), 401

@app.route('/api/auth/register', methods=['POST'])
def register():
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
    result = users.update_one(
        {'_id': ObjectId(user_id)},
        {'$set': data}
    )
    
    if result.modified_count:
        return jsonify({'success': True})
    return jsonify({'error': 'User not found'}), 404

# ==================== EVENT ROUTES ====================

@app.route('/api/events', methods=['GET'])
def get_events():
    all_events = list(events.find())
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
        'imageUrl': data.get('imageUrl', ''),
        'creator': data.get('creator'),
        'status': data.get('status', 'draft'),
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
    
    if event['registered'] >= event['capacity']:
        return jsonify({'error': 'Event is full'}), 400
    
    # Increment registered count
    events.update_one(
        {'_id': ObjectId(event_id)},
        {'$inc': {'registered': 1}}
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
    
    volunteer_data = {
        'userId': data.get('userId'),
        'eventId': data.get('eventId'),
        'role': data.get('role'),
        'hours': data.get('hours'),
        'status': data.get('status', 'upcoming'),
        'registeredAt': datetime.now().isoformat()
    }
    
    result = volunteers.insert_one(volunteer_data)
    
    # Update user's volunteer hours
    users.update_one(
        {'_id': ObjectId(data.get('userId'))},
        {'$inc': {'volunteerHours': data.get('hours', 0)}}
    )
    
    return jsonify({
        'success': True,
        'volunteerId': str(result.inserted_id)
    })

@app.route('/api/volunteers/user/<user_id>', methods=['GET'])
def get_user_volunteer_history(user_id):
    user_volunteers = list(volunteers.find({'userId': user_id}))
    return jsonify([serialize_doc(vol) for vol in user_volunteers])

# ==================== ADMIN ROUTES ====================

@app.route('/api/admin/stats', methods=['GET'])
def get_admin_stats():
    total_users = users.count_documents({})
    active_events = events.count_documents({'status': 'published'})
    total_volunteers = volunteers.count_documents({})
    forum_posts = forum_threads.count_documents({})
    
    return jsonify({
        'totalUsers': total_users,
        'activeEvents': active_events,
        'totalVolunteers': total_volunteers,
        'forumPosts': forum_posts
    })

@app.route('/api/admin/events/pending', methods=['GET'])
def get_pending_events():
    pending = list(events.find({'status': 'pending'}))
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

if __name__ == '__main__':
    app.run(debug=True, port=5000)