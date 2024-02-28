SPECTACULAR_SETTINGS = {
    "TITLE": "Starship API",
    "DESCRIPTION": """
This project is a comprehensive learning management and job posting platform implemented as a RESTful API. Key features include:

- User Management: Supports full CRUD operations for user profiles, including password reset functionality and JWT-based authentication.
- Course Management: Allows the creation, reading, and updating of course offerings. Each course provides a detailed view listing all enrolled students.
- Student Enrollment: Provides a dedicated endpoint for student enrollment in courses, ensuring a single enrollment per user per course.
- Job Postings: Includes functionality for the handling of job postings and company profiles, ensuring a robust platform for students and companies alike.

This API is designed to aid students in course enrollment and job search, and assist companies in finding potential employees. It promises a user-friendly experience with robust functionalities, ensuring optimal benefits for all its users.
""",
    "VERSION": "1.0.0",
    "SERVE_INCLUDE_SCHEMA": False,
    # TODO: before deploy change "SERVE_PUBLIC" to False
    "SERVE_PUBLIC": True,
    # TODO: after adding frontend, add this setting 'SERVE_PERMISSIONS': ['users.permissions.IsAdminUserOrIsStaff']
    "SECURITY_DEFINITIONS": {"Bearer": {"type": "apiKey", "name": "Authorization", "in": "header"}},
}
