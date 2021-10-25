#!/usr/bin/env bash
sudo -u postgres psql -c "DROP DATABASE IF EXISTS cs3219_history"
sudo -u postgres psql -c "DROP DATABASE IF EXISTS cs3219_history_test"
sudo -u postgres psql -c "DROP ROLE IF EXISTS cs3219_history"
sudo -u postgres psql -c "CREATE ROLE cs3219_history WITH CREATEDB LOGIN PASSWORD 'cs3219_history'"
sudo -u postgres psql -c "CREATE DATABASE cs3219_history"
sudo -u postgres psql -c "CREATE DATABASE cs3219_history_test"
