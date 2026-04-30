import random
from datetime import datetime, timedelta
import json
import os

# Constants
COLLEGES = ["SRM Institute of Science and Technology", "VIT Vellore", "IIT Madras", "Anna University", "NIT Trichy", "BITS Pilani"]
BRANCHES = ["Computer Science", "Information Technology", "Electronics & Communication", "Mechanical Engineering", "Electrical Engineering"]
COMPANIES = ["TCS", "Infosys", "Wipro", "HCL", "Accenture India", "Flipkart", "Zomato", "Paytm", "Google India", "Microsoft India", "Amazon India", "Zoho"]
LOCATIONS = ["Chennai", "Bangalore", "Hyderabad", "Mumbai", "Delhi", "Pune", "Gurgaon", "Noida"]
SKILLS = ["React", "Node.js", "Python", "Java", "C++", "DSA", "System Design", "AWS", "SQL", "MongoDB", "Express", "Tailwind CSS", "Machine Learning", "Data Engineering"]

NAMES_MALE = ["Pankaj Kumar", "Rahul Sharma", "Arjun Patel", "Aditya Iyer", "Vikram Singh", "Siddharth Rao", "Karthik Natarajan", "Rohan Gupta", "Nitin Desai", "Suresh Menon", "Pranav Reddy", "Aman Verma", "Deepak Chaurasia", "Mohit Agarwal", "Kunal Shah"]
NAMES_FEMALE = ["Priya Verma", "Ananya Singh", "Sneha Joshi", "Kavya Krishnan", "Neha Kapoor", "Megha Nair", "Pooja Hegde", "Shruti Hassan", "Divya Deshmukh", "Anjali Tiwari", "Rhea Chakraborty", "Ritu Phogat", "Swati Maliwal", "Simran Kaur", "Nidhi Razdan"]
ALL_NAMES = NAMES_MALE + NAMES_FEMALE

random.seed(42)

def generate_email(name, role):
    domain = "alumnilink.edu.in" if role in ['student', 'admin'] else "gmail.com"
    username = name.lower().replace(" ", ".") + str(random.randint(1, 99))
    return f"{username}@{domain}"

def random_date(start_year=2023, end_year=2024):
    start = datetime(start_year, 1, 1)
    end = datetime(end_year, 12, 31)
    return start + timedelta(seconds=random.randint(0, int((end - start).total_seconds())))

def get_sql_date(dt):
    return dt.strftime('%Y-%m-%d %H:%M:%S')

def escape(s):
    return s.replace("'", "''") if s else s

# Generate Users
# 3 Admins, 15 Alumni, 15 Students -> Total 33
users = []
for i in range(1, 34):
    name = ALL_NAMES[i % len(ALL_NAMES)]
    if i <= 3:
        role = 'admin'
        grad_year = random.randint(2010, 2018)
        company = 'AlumniLink Staff'
    elif i <= 18:
        role = 'alumni'
        grad_year = random.randint(2015, 2023)
        company = random.choice(COMPANIES)
    else:
        role = 'student'
        grad_year = random.randint(2025, 2027)
        company = 'NULL'
    
    email = generate_email(name, role)
    college = random.choice(COLLEGES)
    branch = random.choice(BRANCHES)
    user_skills = random.sample(SKILLS, k=random.randint(3, 6))
    created_at = random_date(2023, 2024)
    
    users.append({
        'id': i, 'name': name, 'email': email, 'role': role, 'college': college,
        'branch': branch, 'graduation_year': grad_year, 'company': company,
        'skills': json.dumps(user_skills), 'created_at': created_at
    })

# Mentorship Requests
# Students requesting Alumni
students = [u for u in users if u['role'] == 'student']
alumni = [u for u in users if u['role'] == 'alumni']
mentorship_requests = []
req_id = 1
for student in students:
    # Each student makes 1-3 requests
    for _ in range(random.randint(1, 3)):
        mentor = random.choice(alumni)
        status = random.choice(['pending', 'approved', 'completed', 'rejected'])
        messages = [
            f"Hi {mentor['name'].split()[0]} sir, I am preparing for placements, can you guide me on {random.choice(SKILLS)}?",
            f"Hello! I am highly interested in joining {mentor['company']}. Could we schedule a brief chat?",
            f"Hi {mentor['name'].split()[0]}, I saw your profile and would love to get your resume review for SDE roles.",
            f"Good evening sir, could you share some tips on cracking the {mentor['company']} interview?",
            f"Hello {mentor['name'].split()[0]}, I am looking for guidance in {random.choice(SKILLS)} and System Design."
        ]
        created_at = random_date(2024, 2024)
        mentorship_requests.append({
            'id': req_id, 'student_id': student['id'], 'mentor_id': mentor['id'],
            'message': random.choice(messages), 'status': status, 'created_at': created_at
        })
        req_id += 1

# Chat Messages
messages = []
msg_id = 1
chat_pairs = [(r['student_id'], r['mentor_id']) for r in mentorship_requests if r['status'] in ['approved', 'completed']]

# Add some alumni-alumni chats
for _ in range(5):
    chat_pairs.append((random.choice(alumni)['id'], random.choice(alumni)['id']))

for s_id, m_id in chat_pairs:
    if s_id == m_id: continue
    
    num_messages = random.randint(4, 12)
    base_time = random_date(2024, 2024)
    
    student = next((u for u in users if u['id'] == s_id), None)
    mentor = next((u for u in users if u['id'] == m_id), None)
    
    if not student or not mentor:
        continue

    conversations = [
        [
            (s_id, m_id, f"Hi {mentor['name'].split()[0]} sir, thank you for accepting my request!"),
            (m_id, s_id, f"Hello {student['name'].split()[0]}, happy to help. What specific areas are you focusing on?"),
            (s_id, m_id, f"I am mostly focusing on DSA and React right now. Do you think Node.js is also required for {mentor['company']}?"),
            (m_id, s_id, "Yes, having a good grasp of Node.js definitely gives you an edge. Focus on creating full-stack projects."),
            (s_id, m_id, "Got it! Should I practice Leetcode daily?"),
            (m_id, s_id, "Absolutely. Try solving 2-3 medium questions every day. Consistency is key.")
        ],
        [
            (s_id, m_id, f"Hello sir, do you have any open referrals at {mentor['company']}?"),
            (m_id, s_id, "Hi! Yes, we are hiring for 2025 grads. Please send me your updated resume."),
            (s_id, m_id, "Sure, I will email it to you right away. What does the interview process look like?"),
            (m_id, s_id, "It typically consists of 1 Online Assessment, 2 Technical Rounds (mainly DSA and System Design), and 1 HR round.")
        ],
        [
            (s_id, m_id, "Hi, I just saw the job posting for Frontend Developer. Would my skills in React be sufficient?"),
            (m_id, s_id, "Hey! Yes, React is our primary stack. Make sure you are comfortable with hooks and state management like Redux."),
            (s_id, m_id, "Thank you! I have built a couple of projects using Redux Toolkit. I will apply today."),
            (m_id, s_id, "Great. Let me know once you've applied, I can track your application internally.")
        ],
        [
            (s_id, m_id, "Sir, any specific tips for the technical interview?"),
            (m_id, s_id, "Focus on optimizing your solutions. They usually ask you to start with brute force and then optimize to O(N)."),
            (s_id, m_id, "Understood. Did they ask System Design for freshers?"),
            (m_id, s_id, "Basic Object-Oriented Design and database schema questions. No complex distributed systems.")
        ]
    ]
    
    selected_conv = random.choice(conversations)
    for sender, receiver, text in selected_conv:
        base_time += timedelta(minutes=random.randint(2, 60))
        messages.append({
            'id': msg_id, 'sender_id': sender, 'receiver_id': receiver,
            'message': text, 'timestamp': base_time
        })
        msg_id += 1

# Ensure 100+ messages
while len(messages) < 110:
    s_id = random.choice(students)['id']
    m_id = random.choice(alumni)['id']
    messages.append({
        'id': msg_id, 'sender_id': s_id, 'receiver_id': m_id,
        'message': f"Can you review my project on {random.choice(SKILLS)}?", 'timestamp': random_date(2024, 2024)
    })
    msg_id += 1


# Job Postings
job_postings = []
job_titles = ["Software Development Engineer I", "Frontend Developer", "Backend Engineer", "Data Analyst", "Product Manager", "Machine Learning Engineer", "DevOps Engineer", "Full Stack Developer", "Cloud Architect", "UI/UX Designer"]
job_id = 1
for _ in range(18):
    alumnus = random.choice(alumni)
    title = random.choice(job_titles)
    company = alumnus['company']
    location = random.choice(LOCATIONS)
    salary_range = random.choice(["8-12 LPA", "12-18 LPA", "15-25 LPA", "20-30 LPA", "6-10 LPA", "Not Disclosed"])
    desc = f"We are looking for a passionate {title} to join our team at {company} in {location}. You will be working on scalable systems and high-impact projects. Preferred skills include {random.choice(SKILLS)} and {random.choice(SKILLS)}."
    created_at = random_date(2024, 2024)
    
    job_postings.append({
        'id': job_id, 'title': title, 'company': company, 'location': location,
        'salary_range': salary_range, 'description': desc, 'posted_by': alumnus['id'],
        'created_at': created_at
    })
    job_id += 1

# Events
events = []
event_titles = [
    "Alumni Meetup {loc}", "Tech Talk: AI & Future in India", "Career Guidance Seminar 2024",
    "Web3 and Blockchain Workshop", "Cracking the Coding Interview with {company} Engineers",
    "Startup Founders Panel", "Annual Alumni Gala", "Resume Building Workshop",
    "System Design Masterclass by {company}", "Networking Mixer in {loc}"
]
event_id = 1
for _ in range(14):
    alumnus_or_admin = random.choice([u for u in users if u['role'] in ['admin', 'alumni']])
    loc = random.choice(LOCATIONS)
    company = alumnus_or_admin.get('company', 'TCS')
    if company == 'NULL': company = 'TCS'
    
    title = random.choice(event_titles).format(loc=loc, company=company)
    desc = f"Join us for an exciting session on {title}. Connect with industry experts, network with peers, and learn about the latest trends."
    date = random_date(2024, 2025)
    created_at = date - timedelta(days=random.randint(10, 30))
    
    events.append({
        'id': event_id, 'title': title, 'description': desc, 'date': date,
        'organizer_id': alumnus_or_admin['id'], 'location': loc, 'created_at': created_at
    })
    event_id += 1

# Event Registrations
event_registrations = []
reg_id = 1
for event in events:
    # 5-20 users register for each event
    num_regs = random.randint(5, 20)
    registered_users = random.sample(users, k=min(num_regs, len(users)))
    for u in registered_users:
        registered_at = event['created_at'] + timedelta(days=random.randint(1, 5))
        event_registrations.append({
            'id': reg_id, 'user_id': u['id'], 'event_id': event['id'],
            'registered_at': registered_at
        })
        reg_id += 1

# Notifications
notifications = []
notif_id = 1
for req in mentorship_requests:
    if req['status'] == 'approved':
        notifications.append({
            'id': notif_id, 'user_id': req['student_id'],
            'message': f"Your mentorship request with Mentor #{req['mentor_id']} was approved!",
            'is_read': random.choice([True, False]),
            'created_at': req['created_at'] + timedelta(days=1)
        })
        notif_id += 1

for job in job_postings:
    # Notify 3 random students
    for u in random.sample(students, k=3):
        notifications.append({
            'id': notif_id, 'user_id': u['id'],
            'message': f"New job posted at {job['company']}: {job['title']}",
            'is_read': random.choice([True, False]),
            'created_at': job['created_at'] + timedelta(hours=2)
        })
        notif_id += 1

# User Sessions
user_sessions = []
session_id = 1
devices = ["MacBook Pro - Chrome", "Windows 11 - Edge", "iPhone 13 - Safari", "Android - Chrome", "Linux - Firefox", "iPad Pro - Safari"]
for u in users:
    for _ in range(random.randint(2, 5)):
        user_sessions.append({
            'id': session_id, 'user_id': u['id'], 'device': random.choice(devices),
            'login_time': random_date(2024, 2024)
        })
        session_id += 1

# Write to SQL
output_file = os.path.join(os.path.dirname(os.path.abspath(__file__)), "alumnilink_seed.sql")
with open(output_file, "w", encoding="utf-8") as f:
    f.write("-- =======================================================\n")
    f.write("-- AlumniLink - Alumni Management and Engagement System\n")
    f.write("-- Realistic Production-like Seed Data (Indian Context)\n")
    f.write("-- =======================================================\n\n")
    
    f.write("CREATE DATABASE IF NOT EXISTS alumnilink;\n")
    f.write("USE alumnilink;\n\n")
    f.write("SET FOREIGN_KEY_CHECKS = 0;\n\n")
    
    tables = [
        "user_sessions", "notifications", "event_registrations",
        "events", "job_postings", "messages", "mentorship_requests", "users"
    ]
    for table in tables:
        f.write(f"DROP TABLE IF EXISTS {table};\n")
    f.write("\n")
    
    f.write('''CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    role ENUM('student', 'alumni', 'admin') NOT NULL,
    college VARCHAR(255) NOT NULL,
    branch VARCHAR(100),
    graduation_year INT,
    company VARCHAR(255),
    skills JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);\n\n''')

    f.write('''CREATE TABLE mentorship_requests (
    id INT AUTO_INCREMENT PRIMARY KEY,
    student_id INT NOT NULL,
    mentor_id INT NOT NULL,
    message TEXT,
    status ENUM('pending', 'approved', 'completed', 'rejected') DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (student_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (mentor_id) REFERENCES users(id) ON DELETE CASCADE
);\n\n''')

    f.write('''CREATE TABLE messages (
    id INT AUTO_INCREMENT PRIMARY KEY,
    sender_id INT NOT NULL,
    receiver_id INT NOT NULL,
    message TEXT NOT NULL,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (sender_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (receiver_id) REFERENCES users(id) ON DELETE CASCADE
);\n\n''')

    f.write('''CREATE TABLE job_postings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    company VARCHAR(255) NOT NULL,
    location VARCHAR(255) NOT NULL,
    salary_range VARCHAR(100),
    description TEXT,
    posted_by INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (posted_by) REFERENCES users(id) ON DELETE CASCADE
);\n\n''')

    f.write('''CREATE TABLE events (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    date DATETIME NOT NULL,
    organizer_id INT NOT NULL,
    location VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (organizer_id) REFERENCES users(id) ON DELETE CASCADE
);\n\n''')

    f.write('''CREATE TABLE event_registrations (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    event_id INT NOT NULL,
    registered_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE,
    UNIQUE(user_id, event_id)
);\n\n''')

    f.write('''CREATE TABLE notifications (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    message TEXT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);\n\n''')

    f.write('''CREATE TABLE user_sessions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    device VARCHAR(255),
    login_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);\n\n''')

    f.write("SET FOREIGN_KEY_CHECKS = 1;\n\n")
    
    # Inserts
    def write_inserts(table_name, columns, data_list):
        if not data_list: return
        f.write(f"-- Data for table `{table_name}`\n")
        f.write(f"INSERT INTO {table_name} ({', '.join(columns)}) VALUES\n")
        
        values_lines = []
        for row in data_list:
            vals = []
            for col in columns:
                val = row[col]
                if val is None or val == 'NULL':
                    vals.append('NULL')
                elif isinstance(val, bool):
                    vals.append('TRUE' if val else 'FALSE')
                elif isinstance(val, (int, float)):
                    vals.append(str(val))
                elif isinstance(val, datetime):
                    vals.append(f"'{get_sql_date(val)}'")
                else:
                    vals.append(f"'{escape(str(val))}'")
            values_lines.append(f"    ({', '.join(vals)})")
        
        f.write(",\n".join(values_lines) + ";\n\n")

    write_inserts('users', ['id', 'name', 'email', 'role', 'college', 'branch', 'graduation_year', 'company', 'skills', 'created_at'], users)
    write_inserts('mentorship_requests', ['id', 'student_id', 'mentor_id', 'message', 'status', 'created_at'], mentorship_requests)
    write_inserts('messages', ['id', 'sender_id', 'receiver_id', 'message', 'timestamp'], messages)
    write_inserts('job_postings', ['id', 'title', 'company', 'location', 'salary_range', 'description', 'posted_by', 'created_at'], job_postings)
    write_inserts('events', ['id', 'title', 'description', 'date', 'organizer_id', 'location', 'created_at'], events)
    write_inserts('event_registrations', ['id', 'user_id', 'event_id', 'registered_at'], event_registrations)
    write_inserts('notifications', ['id', 'user_id', 'message', 'is_read', 'created_at'], notifications)
    write_inserts('user_sessions', ['id', 'user_id', 'device', 'login_time'], user_sessions)

print(f"Data generation complete. Saved to {output_file}")
