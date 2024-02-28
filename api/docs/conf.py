import os
import sys
import django

from datetime import date

PROJECT_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, PROJECT_DIR)
os.environ['DJANGO_SETTINGS_MODULE'] = 'config.settings'

django.setup()

# -- Project information -----------------------------------------------------

project = 'Starship'
copyright = f'{date.today().year}, Azeno Team'
author = 'Azeno Team'
release = '1.0.0'

# -- General configuration ---------------------------------------------------

extensions = ['sphinx.ext.autodoc', 'sphinx_rtd_theme']

templates_path = ['_templates']
exclude_patterns = ['_build', 'Thumbs.db', '.DS_Store']

# -- Options for HTML output -------------------------------------------------

html_theme = 'sphinx_rtd_theme'
html_static_path = ['_static']
html_title = f'{project} Documentation'
