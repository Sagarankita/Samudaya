from pymongo import MongoClient
from werkzeug.security import generate_password_hash
from datetime import datetime, timedelta

# MongoDB Connection
client = MongoClient('mongodb://localhost:27017/')
db = client['samudaya_events']

# Clear existing data
db.users.delete_many({})
db.events.delete_many({})
db.announcements.delete_many({})
db.forum_threads.delete_many({})
db.volunteers.delete_many({})

print("Cleared existing data...")

# Create Admin User
admin_user = {
    'name': 'Admin',
    'email': 'admin@samudaya.com',
    'password': generate_password_hash('admin123'),
    'role': 'admin',
    'joinDate': datetime.now().isoformat(),
    'eventsCreated': 0,
    'volunteerHours': 0,
    'status': 'active'
}
admin_id = db.users.insert_one(admin_user).inserted_id
print(f"Created admin user: {admin_id}")

# Create Regular Users
users_data = [
    {
        'name': 'Rajesh Kumar',
        'email': 'rajesh@example.com',
        'password': generate_password_hash('password123'),
        'role': 'member',
        'joinDate': '2025-03-15T00:00:00',
        'eventsCreated': 3,
        'volunteerHours': 28,
        'status': 'active'
    },
    {
        'name': 'Sarah Johnson',
        'email': 'sarah@example.com',
        'password': generate_password_hash('password123'),
        'role': 'organizer',
        'joinDate': '2025-01-10T00:00:00',
        'eventsCreated': 12,
        'volunteerHours': 45,
        'status': 'active'
    },
    {
        'name': 'Mike Chen',
        'email': 'mike@example.com',
        'password': generate_password_hash('password123'),
        'role': 'member',
        'joinDate': '2025-04-22T00:00:00',
        'eventsCreated': 1,
        'volunteerHours': 10,
        'status': 'active'
    },
    {
        'name': 'Priya Sharma',
        'email': 'priya@example.com',
        'password': generate_password_hash('password123'),
        'role': 'member',
        'joinDate': '2025-02-20T00:00:00',
        'eventsCreated': 5,
        'volunteerHours': 32,
        'status': 'active'
    }
]

user_ids = []
for user in users_data:
    user_id = db.users.insert_one(user).inserted_id
    user_ids.append(user_id)
print(f"Created {len(user_ids)} regular users")

# Create Events
events_data = [
    {
        'title': 'Swachh Bharat Cleanup Drive',
        'description': 'Join us for a community cleanup drive to keep our parks beautiful and clean.',
        'date': '2025-10-15',
        'time': '9:00 AM',
        'location': 'Cubbon Park, Bengaluru',
        'category': 'Volunteer',
        'capacity': 50,
        'registered': 32,
        'imageUrl': 'https://images.unsplash.com/photo-1758599668125-e154250f24bd',
        'creator': str(user_ids[0]),
        'status': 'published',
        'tags': ['cleanup', 'environment', 'community'],
        'createdAt': datetime.now().isoformat()
    },
    {
        'title': 'Diwali Mela & Cultural Night',
        'description': 'An evening of classical music, street food stalls, and festive celebrations.',
        'date': '2025-10-20',
        'time': '6:00 PM',
        'location': 'India Gate, Delhi',
        'category': 'Entertainment',
        'capacity': 200,
        'registered': 145,
        'imageUrl': 'https://images.unsplash.com/photo-1759306221569-028a35bc8c66',
        'creator': str(user_ids[1]),
        'status': 'published',
        'tags': ['festival', 'cultural', 'entertainment'],
        'createdAt': datetime.now().isoformat()
    },
    {
        'title': 'Youth Sports Day',
        'description': 'Traditional and modern sports activities for youth aged 10-18.',
        'date': '2025-10-17',
        'time': '2:00 PM',
        'location': 'Nehru Stadium, Mumbai',
        'category': 'Sports',
        'capacity': 100,
        'registered': 67,
        'imageUrl': 'https://images.unsplash.com/photo-1632580254134-94c4a73dab76',
        'creator': str(user_ids[0]),
        'status': 'published',
        'tags': ['sports', 'youth', 'fitness'],
        'createdAt': datetime.now().isoformat()
    },
    {
        'title': 'Traditional Art Workshop',
        'description': 'Learn Madhubani, Warli, and contemporary art from local artists.',
        'date': '2025-10-22',
        'time': '10:00 AM',
        'location': 'Lalit Kala Akademi, Delhi',
        'category': 'Education',
        'capacity': 30,
        'registered': 18,
        'imageUrl': 'https://images.unsplash.com/photo-1585984968562-1443b72fb0dc',
        'creator': str(user_ids[1]),
        'status': 'published',
        'tags': ['art', 'education', 'traditional'],
        'createdAt': datetime.now().isoformat()
    },
    {
        'title': 'Photography Walk',
        'description': 'Explore the city through your lens with professional photographers.',
        'date': '2025-11-05',
        'time': '7:00 AM',
        'location': 'Gateway of India, Mumbai',
        'category': 'Education',
        'capacity': 25,
        'registered': 0,
        'imageUrl': 'https://images.unsplash.com/photo-1452587925148-ce544e77e70d',
        'creator': str(user_ids[2]),
        'status': 'pending',
        'tags': ['photography', 'art', 'learning'],
        'createdAt': datetime.now().isoformat()
    }
]

event_ids = []
for event in events_data:
    event_id = db.events.insert_one(event).inserted_id
    event_ids.append(event_id)
print(f"Created {len(event_ids)} events")

# Create Announcements
announcements_data = [
    {
        'title': 'New Online Registration Portal Launched',
        'content': "We've launched our new online registration system to make it easier for you to sign up for community events.",
        'type': 'Info',
        'author': 'Admin Team',
        'date': '2025-10-05T00:00:00',
        'expiresOn': '2025-11-05'
    },
    {
        'title': 'Weather Alert: Cleanup Drive Postponed',
        'content': 'Due to heavy monsoon rains, the Swachh Bharat Cleanup Drive scheduled for Oct 10 has been postponed to Oct 15.',
        'type': 'Emergency',
        'author': 'Priya Sharma, Event Coordinator',
        'date': '2025-10-08T00:00:00',
        'expiresOn': '2025-10-16'
    },
    {
        'title': 'Volunteer Appreciation Day Celebration',
        'content': 'Join us on November 1st for our annual Volunteer Appreciation Day!',
        'type': 'Event Update',
        'author': 'Amit Patel, Community Manager',
        'date': '2025-10-03T00:00:00',
        'expiresOn': '2025-11-02'
    }
]

for announcement in announcements_data:
    db.announcements.insert_one(announcement)
print(f"Created {len(announcements_data)} announcements")

# Create Forum Threads
forum_threads_data = [
    {
        'title': 'Ideas for Winter Festival Activities',
        'author': 'Sarah Johnson',
        'category': 'Ideas',
        'replies': 12,
        'likes': 24,
        'tags': ['Suggestion', 'Event Planning'],
        'isPinned': True,
        'flags': 0,
        'createdAt': (datetime.now() - timedelta(hours=2)).isoformat(),
        'lastActivity': (datetime.now() - timedelta(minutes=15)).isoformat()
    },
    {
        'title': 'Parking Arrangements at Nehru Stadium',
        'author': 'Amit Patel',
        'category': 'Help',
        'replies': 5,
        'likes': 8,
        'tags': ['Question', 'Logistics'],
        'isPinned': False,
        'flags': 0,
        'createdAt': (datetime.now() - timedelta(hours=5)).isoformat(),
        'lastActivity': (datetime.now() - timedelta(hours=1)).isoformat()
    },
    {
        'title': 'Thank You to All Cleanup Day Volunteers!',
        'author': 'Sneha Reddy',
        'category': 'Feedback',
        'replies': 18,
        'likes': 45,
        'tags': ['Appreciation'],
        'isPinned': False,
        'flags': 0,
        'createdAt': (datetime.now() - timedelta(days=1)).isoformat(),
        'lastActivity': (datetime.now() - timedelta(hours=3)).isoformat()
    }
]

for thread in forum_threads_data:
    db.forum_threads.insert_one(thread)
print(f"Created {len(forum_threads_data)} forum threads")

# Create Volunteer Records
volunteers_data = [
    {
        'userId': str(user_ids[0]),
        'eventId': str(event_ids[0]),
        'role': 'Cleanup Crew',
        'hours': 4,
        'status': 'upcoming',
        'registeredAt': datetime.now().isoformat()
    },
    {
        'userId': str(user_ids[0]),
        'eventId': str(event_ids[1]),
        'role': 'Setup Team',
        'hours': 5,
        'status': 'upcoming',
        'registeredAt': datetime.now().isoformat()
    }
]

for volunteer in volunteers_data:
    db.volunteers.insert_one(volunteer)
print(f"Created {len(volunteers_data)} volunteer records")

print("\n✅ Database seeded successfully!")
print(f"\nAdmin Login:")
print(f"Email: admin@samudaya.com")
print(f"Password: admin123")
print(f"\nUser Login:")
print(f"Email: rajesh@example.com")
print(f"Password: password123")