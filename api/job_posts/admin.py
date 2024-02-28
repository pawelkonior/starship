from django.contrib import admin
from .models import Company, JobPost


class CompanyAdmin(admin.ModelAdmin):
    list_display = ["company_name", "is_verified"]
    list_filter = ["is_verified"]
    search_fields = ["company_name"]


class JobPostAdmin(admin.ModelAdmin):
    list_display = ["title", "company", "posting_date", "location"]
    list_filter = ["posting_date", "company", "location"]
    search_fields = ["title", "description", "company", "posting_date", "location"]


admin.site.register(Company, CompanyAdmin)
admin.site.register(JobPost, JobPostAdmin)
