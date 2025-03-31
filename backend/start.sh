#!/bin/sh


until psql "$DATABASE_URL" -c '\l' > /dev/null 2>&1; do
  echo "Waiting for PostgreSQL to be ready..."
  sleep 2
done

#  migration
python manage.py makemigrations
python manage.py migrate


if [ "$DEBUG" = "True" ]; then
  python manage.py runserver 0.0.0.0:8000
else
  gunicorn your_django_app.wsgi:application --bind 0.0.0.0:8000
fi