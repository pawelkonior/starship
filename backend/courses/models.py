from django.db import models
from django.contrib.auth import get_user_model

User = get_user_model()


class Course(models.Model):
    owner = models.ForeignKey(User, related_name="courses", on_delete=models.CASCADE)
    name = models.CharField(max_length=300)
    description = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    tags = models.ManyToManyField("Tag", related_name="courses")

    class Meta:
        verbose_name = "Course"
        verbose_name_plural = "Courses"

    def __str__(self):
        return self.name


class ProgrammePoint(models.Model):
    name = models.CharField(max_length=300)
    description = models.TextField()
    course = models.ForeignKey("Course", related_name="programme_points", on_delete=models.CASCADE)

    def __str__(self):
        return self.name


class Tag(models.Model):
    name = models.CharField(max_length=50)

    def __str__(self):
        return self.name


class Roadmap(models.Model):
    topic = models.TextField(max_length=250)
    description = models.TextField(max_length=500)
    created_at = models.DateTimeField(auto_now_add=True)
    owner = models.ForeignKey('users.CustomUser', related_name='roadmaps', on_delete=models.CASCADE)
    tags = models.ManyToManyField('Tag')

    def __str__(self):
        return self.topic


class LearningStages(models.Model):
    roadmap = models.ForeignKey('Roadmap', related_name='stages', on_delete=models.CASCADE)
    stage_num = models.IntegerField()
    name = models.TextField(max_length=250)
    description = models.TextField(max_length=500)

    class Meta:
        verbose_name = "Learning stage"
        verbose_name_plural = "Learning stages"

    def __str__(self):
        return self.name



class Enrollment(models.Model):
    student = models.ForeignKey(User, related_name="enrolled_courses", on_delete=models.CASCADE)
    course = models.ForeignKey(Course, related_name="enrolled_students", on_delete=models.CASCADE)
    date_enrollment = models.DateTimeField(auto_now_add=True)
    duration = models.IntegerField()
    scheduled_at = models.DateTimeField()

    def __str__(self):
        return self.course


class Picture(models.Model):
    project = models.ForeignKey("Project", related_name="pictures", on_delete=models.CASCADE)
    image = models.FileField(default=None, upload_to="project_pictures/")

    # def __str__(self):
    #     return self.image


class Project(models.Model):
    owner = models.ForeignKey(User, related_name="projects", on_delete=models.CASCADE)
    name = models.CharField(max_length=200)
    description = models.TextField(max_length=500)
    link = models.URLField(max_length=200)

    def __str__(self):
        return self.name
