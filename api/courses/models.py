from django.contrib.auth import get_user_model
from django.core.validators import MaxValueValidator, MinValueValidator
from django.db import models

CustomUser = get_user_model()


class Course(models.Model):
    """
    Class representing a Course.

    Attributes:
        - created_at (DateTimeField): The date and time when the Course was created.
        - owner (ForeignKey): The owner (creator) of the Course.
        - title (CharField): The title of the Course.
        - description (TextField): The description of the Course.
        - duration (IntegerField): The duration of the Course in minutes.
        - course_date (DateTimeField): The date and time of the Course.
        - is_active (BooleanField): Indicates whether the Course is active or not.
        - is_accepted (BooleanField): Indicates whether the Course has been accepted by an administrator.
        - tags (ManyToManyField): The tags associated with the Course.
        - price (PositiveIntegerField): The price of the Course.
        - link (URLField): The link related to the Course.
        - completed (BooleanField): Indicates whether the Course has been completed or not.
        - image (ImageField): The image associated with the Course.
        - agenda (TextField): The agenda or plan for the Course.
        - level (CharField): The level of the Course.

    Meta:
        - verbose_name (str): The verbose name of the Course.
        - verbose_name_plural (str): The verbose name in plural of the Course.

    Methods:
        - __str__(self): Returns the title of the Course as a string.
    """
    created_at = models.DateTimeField(auto_now_add=True, verbose_name="Stworzony")
    owner = models.ForeignKey(CustomUser, related_name="courses", on_delete=models.DO_NOTHING, verbose_name="Twórca")
    title = models.CharField(max_length=200, verbose_name="Tytuł")
    description = models.TextField(verbose_name="Opis")
    duration = models.IntegerField(verbose_name="Czas trwania")
    course_date = models.DateTimeField(null=True, verbose_name="Dzień i godzina")
    is_active = models.BooleanField(default=True, verbose_name="Aktywny")
    is_accepted = models.BooleanField(
        default=False,
        verbose_name="Czy zaakceptowano?",
        help_text="Czy kurs został zaakceptowany przez administratora?",
    )
    tags = models.ManyToManyField("Tag", verbose_name="Tagi", blank=True)
    price = models.PositiveIntegerField(
        null=False, blank=False, verbose_name="Wpisowe", validators=[MaxValueValidator(100)]
    )
    link = models.URLField(verbose_name="Link", null=True, blank=True)
    completed = models.BooleanField(default=False, verbose_name="Zakończony")
    image = models.ImageField(upload_to="uploads/", null=True, blank=True, verbose_name="Miniaturka")
    agenda = models.TextField(verbose_name="Plan kursu")
    COURSE_LEVEL_CHOICES = (
        ("Beginner", "Beginner"),
        ("Intermediate", "Intermediate"),
        ("Advanced", "Advanced"),
        ("Expert", "Expert"),
    )
    level = models.CharField(max_length=15, choices=COURSE_LEVEL_CHOICES)

    class Meta:
        verbose_name = "Kurs"
        verbose_name_plural = "Kursy"

    def __str__(self):
        return self.title


class Enrollment(models.Model):
    """


    Enrollment model represents the relationship between a Course and a Student.


    Attributes:
        - course (ForeignKey): The foreign key to the Course model representing the enrolled course.
        - student (ForeignKey): The foreign key to the CustomUser model representing the enrolled student.
        - enrollment_date (DateTimeField): The date and time when the enrollment was made (automatically generated).
        - is_active (BooleanField): Indicates if the enrollment is active or not.


    Meta:
        - unique_together (tuple): A tuple specifying the fields that must be unique together (course and student).
        - verbose_name (str): The singular name for the Enrollment model (Uczestnik kursu).
        - verbose_name_plural (str): The plural name for the Enrollment model (Uczestnicy kursów).


    Methods:
        - __str__(): Returns a string representation of the Enrollment instance in the format "{student's full name} - {course title}".

    """
    course = models.ForeignKey("Course", related_name="enrollments", on_delete=models.CASCADE, verbose_name="Kurs")
    student = models.ForeignKey(
        CustomUser, related_name="enrollments", on_delete=models.CASCADE, verbose_name="Student"
    )
    enrollment_date = models.DateTimeField(auto_now_add=True, verbose_name="Data zapisu")
    is_active = models.BooleanField(default=True, verbose_name="Zapisany")

    class Meta:
        unique_together = ("course", "student")
        verbose_name = "Uczestnik kursu"
        verbose_name_plural = "Uczestnicy kursów"

    def __str__(self):
        return f"{self.student.get_full_name()} - {self.course.title}"


class Tag(models.Model):
    """
    A class representing a tag.

    Attributes:
        - name (CharField): The name of the tag.

    Meta Attributes:
        - verbose_name (str): The verbose name of the tag.
        - verbose_name_plural (str): The verbose plural name of the tag.

    Methods:
        - __str__(): Returns a string representation of the tag.

    """
    name = models.CharField(max_length=200, unique=True, verbose_name="Tag")

    class Meta:
        verbose_name = "Tag"
        verbose_name_plural = "Tagi"

    def __str__(self):
        return self.name


class ScoreChange(models.Model):
    """

    The `ScoreChange` class represents changes in the score of a user.

    Attributes:
        - user: A foreign key to the CustomUser model representing the user who experienced the score change.
        - amount: An integer field representing the amount of the score change.
        - created_at: A datetime field representing the date and time when the score change was created.
        - description: A text field representing the description of the score change.

    Meta:
        - verbose_name: A string representing the verbose name for the ScoreChange model.
        - verbose_name_plural: A string representing the verbose name in plural for the ScoreChange model.

    Methods:
        - __str__(): Returns a string representation of the ScoreChange object.

    """
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name="score_changes", verbose_name="Użytkownik")
    amount = models.IntegerField(verbose_name="Ilość")
    created_at = models.DateTimeField(auto_now_add=True, )
    description = models.TextField(verbose_name="Opis", default="Brak informacji")

    class Meta:
        verbose_name = "Punkty"
        verbose_name_plural = "Punkty"

    def __str__(self):
        sign = "+" if self.amount > 0 else ""
        return f"{self.user} - {self.description} -> {sign}{self.amount}"


class CourseReview(models.Model):
    """
    Represents a review for a course.

    Attributes:
        - user (ForeignKey): The user who submitted the review.
        - course (ForeignKey): The course being reviewed.
        - note (PositiveIntegerField): The rating given by the user (between 1 and 5).
        - description (TextField): The description provided by the user.

    Meta Fields:
        - verbose_name (str): The singular name for the review model.
        - verbose_name_plural (str): The plural name for the review model.

    Methods:
        - __str__(): Returns a string representation of the review.

    """
    user = models.ForeignKey(CustomUser, on_delete=models.PROTECT)
    course = models.ForeignKey(Course, on_delete=models.CASCADE)
    note = models.PositiveIntegerField(validators=[MinValueValidator(1), MaxValueValidator(5)])
    description = models.TextField(verbose_name="Opis")

    class Meta:
        verbose_name = "Ocena kursu"
        verbose_name_plural = "Oceny kursów"

    def __str__(self):
        return f"{self.course}, Ocena: {self.note}/5, Opis: {self.description}"
