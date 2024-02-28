from django.db import models
from django.contrib.auth import get_user_model

CustomUser = get_user_model()


class Project(models.Model):
    """

    The Project class represents a project in the system.

    Attributes:
        - owner (CustomUser): The owner of the project.
        - title (str): The title of the project.
        - description (str): The description of the project (optional).
        - source_code_link (str): The URL of the source code (optional).
        - live_version_link (str): The URL of the live version (optional).
        - tags (ManyToManyField): The tags associated with the project.

    Methods:
        - __str__(): Returns a string representation of the project.

    """
    owner = models.ForeignKey(
        CustomUser, on_delete=models.DO_NOTHING, related_name="projects", verbose_name="Właściciel"
    )
    title = models.CharField(max_length=200, verbose_name="Nazwa projektu")
    description = models.TextField(verbose_name="Opis projektu", null=True, blank=True)
    source_code_link = models.URLField(verbose_name="Kod źródłowy", null=True, blank=True)
    live_version_link = models.URLField(verbose_name="Link do działającej wersji", null=True, blank=True)
    tags = models.ManyToManyField("courses.Tag", verbose_name="Tagi", blank=True)

    class Meta:
        verbose_name = "Projekt"
        verbose_name_plural = "Projekty"

    def __str__(self):
        return f"Project: {self.title} made by {self.owner.get_full_name()}"


class ProjectImage(models.Model):
    """
    Class ProjectImage

    Model class representing an image related to a project.

    Attributes:
        - project: ForeignKey to Project model. The project related to the image.
        - image: FileField. The image file uploaded.

    Meta:
        - verbose_name: str. Specifies a human-readable name for the model (singular).
        - verbose_name_plural: str. Specifies a human-readable name for the model (plural).

    Methods:
        - __str__: Returns a string representation of the image in the format "Image for {project title} - {image name}".
    """
    project = models.ForeignKey(Project, on_delete=models.CASCADE, related_name="images", verbose_name="Projekt")
    image = models.FileField(upload_to="project_images", verbose_name="Obraz")

    class Meta:
        verbose_name = "Obraz projektu"
        verbose_name_plural = "Obrazy projektów"

    def __str__(self):
        return f"Image for {self.project.title} - {self.image.name}"
