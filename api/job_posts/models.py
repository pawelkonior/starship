from django.conf import settings
from django.db import models


class Company(models.Model):
    """
    Class representing a Company.

    Attributes:
        - company_name (CharField): Name of the company.
        - company_address (CharField): Address of the company.
        - phone_number (CharField): Phone number of the company.
        - website (URLField): Website of the company.
        - is_verified (BooleanField): Flag indicating if the company is verified.
        - created_at (DateTimeField): Timestamp representing when the company was created.
        - updated_at (DateTimeField): Timestamp representing when the company was last updated.

    Meta:
        - verbose_name (str): Singular form of the verbose name for the model in the admin interface.
        - verbose_name_plural (str): Plural form of the verbose name for the model in the admin interface.

    Methods:
        - __str__(): Returns a string representation of the company.
    """
    company_name = models.CharField(max_length=100, verbose_name="Nazwa firmy")
    company_address = models.CharField(max_length=200, verbose_name="Adres firmy")
    phone_number = models.CharField(max_length=15, verbose_name="Numer telefonu")
    website = models.URLField(max_length=200, verbose_name="Strona www", null=True, blank=True)
    is_verified = models.BooleanField(
        default=False, verbose_name="Zweryfikowana?", help_text="Czy firma jest zweryfikowana"
    )
    created_at = models.DateTimeField(auto_now_add=True, verbose_name="Stworzona:")
    updated_at = models.DateTimeField(auto_now=True, verbose_name="Zaktualizowana:")

    class Meta:
        verbose_name = "Firma"
        verbose_name_plural = "Firmy"

    def __str__(self):
        return self.company_name


class JobPost(models.Model):
    """
    JobPost represents a job posting.

    Attributes:
        - title (str): The title of the job.
        - description (str): The description of the job.
        - company (ForeignKey): The company associated with the job.
        - employment_type (str, optional): The employment type for the job.
        - location (str, optional): The location of the job.
        - salary_high (float, optional): The upper limit of the salary for the job.
        - salary_low (float, optional): The lower limit of the salary for the job.
        - posting_date (DateTime): The date when the job was posted.
        - expiration_date (DateTime, optional): The date when the job expires.
        - experience (str, optional): The required experience for the job.
        - position (str, optional): The position for the job.

    Meta:
        - verbose_name (str): The verbose name for a single job post.
        - verbose_name_plural (str): The verbose name for multiple job posts.

    Methods:
        - __str__(): Returns the title of the job.
    """
    title = models.CharField(max_length=200, verbose_name="Nazwa")
    description = models.TextField(verbose_name="Opis")
    company = models.ForeignKey(Company, on_delete=models.CASCADE, related_name="company_posts", verbose_name="Firma")
    employment_type = models.CharField(max_length=50, verbose_name="Forma zatrudnienia", null=True, blank=True)
    location = models.CharField(max_length=200, verbose_name="Lokalizacja", null=True, blank=True)
    salary_high = models.DecimalField(
        max_digits=10, decimal_places=2, verbose_name="Górna granica wynagrodzenia", null=True, blank=True
    )
    salary_low = models.DecimalField(
        max_digits=10, decimal_places=2, verbose_name="Dolna granica wynagrodzenia", null=True, blank=True
    )
    posting_date = models.DateTimeField(auto_now_add=True, verbose_name="Data ogłoszenia")
    expiration_date = models.DateTimeField(verbose_name="Data wygaśnięcia", null=True, blank=True)
    experience = models.TextField(verbose_name="Oczekiwane doświadczenie", null=True, blank=True)
    position = models.CharField(max_length=200, verbose_name="Stanowisko", null=True, blank=True)

    class Meta:
        verbose_name = "Ogłoszenie"
        verbose_name_plural = "Ogłoszenia"

    def __str__(self):
        return self.title
