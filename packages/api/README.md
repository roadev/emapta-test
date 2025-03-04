# EHR Integration API

This project is a full-stack API system designed to handle and send patient data to various Electronic Health Record (EHR) systems. It showcases a modular and scalable architecture with dynamic mapping, robust input validation, JWT-based authentication, caching with Redis, performance monitoring using Prometheus/Grafana, Node.js clustering, and multi-language support (English and Spanish).

---

## Table of Contents

- [EHR Integration API](#ehr-integration-api)
  - [Table of Contents](#table-of-contents)
  - [Overview](#overview)
  - [Features](#features)
  - [Architecture](#architecture)
  - [API Endpoints](#api-endpoints)
    - [Authentication](#authentication)
    - [Patient Management](#patient-management)
    - [EHR Mapping Management](#ehr-mapping-management)
  - [Setup \& Installation](#setup--installation)
    - [Prerequisites](#prerequisites)
    - [Install](#install)
    - [Starting the server](#starting-the-server)
    - [Running as cluster](#running-as-cluster)
    - [Run docker services](#run-docker-services)
  - [Tests](#tests)
  - [Performing benkmark and stress tests](#performing-benkmark-and-stress-tests)
  - [Frontend](#frontend)
    - [Features](#features-1)
    - [Install](#install-1)
    - [Starting the dev server](#starting-the-dev-server)

---

## Overview

This API provides endpoints for:
- **Patient Management:** Create, retrieve, update, delete, and list patients.
- **Dynamic Mapping Integration:** Manage EHR mappings with CRUD operations and transform patient data dynamically based on the selected EHR.
- **Security & Validation:** Input validation with Zod and JWT-based authentication to ensure data integrity and secure access.
- **Caching:** Use Redis to cache frequently accessed data (e.g., EHR mappings and patient lists) for improved performance.
- **Performance Monitoring:** Expose metrics via Prometheus and visualize them using Grafana.
- **Scalability:** Use Node.js clustering to leverage multiple CPU cores for improved concurrent request handling.
- **Multi-Language Support:** Provide localized messages (e.g., for error and success responses) in English and Spanish via i18next.

---

## Features

- **Dynamic EHR Mapping:** Easily add or update mappings to support different EHR systems.
- **Patient CRUD Operations:** Full RESTful endpoints to manage patient records.
- **Input Validation:** Robust data validation using Zod.
- **JWT Authentication:** Secure the endpoints so only authenticated users can access them.
- **Caching:** Optimize performance with Redis caching and fallback mechanisms.
- **Audit Logging:** Track changes to patient records for compliance and troubleshooting.
- **Monitoring:** Performance metrics are collected via Prometheus and visualized in Grafana.
- **Clustering:** Utilize Node's built-in Cluster module to scale across multiple CPU cores.
- **Multi-Language Support:** Internationalize response messages with i18next.

---

## Architecture

- **Backend Framework:** Node.js with Express, written in TypeScript.
- **Database:** MongoDB is used to store patient data and mapping configurations.
- **Caching Layer:** Redis is used for caching frequently accessed data.
- **Authentication:** JWT-based authentication secures the API endpoints.
- **Internationalization:** i18next handles multi-language support.
- **Monitoring:** Prometheus scrapes metrics from the API, and Grafana visualizes them.
- **Clustering:** Node's Cluster module distributes load across CPU cores.

---

---

## API Endpoints

### Authentication

- **Register User**
  - **URL:** `POST /api/auth/register`
  - **Headers:** `Content-Type: application/json`
  - **Body:**
    ```json
    {
      "email": "test@example.com",
      "password": "StrongPassword123",
      "name": "Test User"
    }
    ```
  - **Response:** 
    ```json
    {
      "token": "<jwt_token>",
      "user": {
        "id": "<user_id>",
        "email": "test@example.com",
        "name": "Test User"
      },
      "message": "User registered successfully"
    }
    ```

- **Login**
  - **URL:** `POST /api/auth/login`
  - **Headers:** `Content-Type: application/json`
  - **Body:**
    ```json
    {
      "email": "test@example.com",
      "password": "StrongPassword123"
    }
    ```
  - **Response:**
    ```json
    {
      "token": "<jwt_token>",
      "user": {
        "id": "<user_id>",
        "email": "test@example.com",
        "name": "Test User"
      },
      "message": "Login successful"
    }
    ```

### Patient Management

- **Create Patient**
  - **URL:** `POST /api/patients`
  - **Headers:** 
    - `Content-Type: application/json`
    - `Authorization: Bearer <jwt_token>`
  - **Body:**
    ```json
    {
      "name": "John Doe",
      "gender": "Male",
      "dob": "1990-01-01",
      "address": "123 Main St",
      "phone": "555-1234",
      "email": "john.doe@example.com",
      "emergencyContact": { "name": "Jane Doe", "phone": "555-5678" },
      "primaryCarePhysician": "Dr. Smith",
      "insuranceProvider": "HealthCare Inc.",
      "insurancePolicyNumber": "HC123456",
      "allergies": ["Peanuts"],
      "currentMedications": ["Medication A"],
      "medicalHistory": "None",
      "socialHistory": "Non-smoker",
      "familyHistory": "No major issues",
      "languagePreference": "en",
      "notes": "Initial registration"
    }
    ```
  - **Response:**
    ```json
    {
      "patient": { ...patient_object... },
      "message": "Patient created successfully"
    }
    ```

- **Get Patient**
  - **URL:** `GET /api/patients/:id`
  - **Headers:** `Authorization: Bearer <jwt_token>`
  - **Response (if found):**
    ```json
    {
      ...patient_object...
    }
    ```
  - **Response (if not found or invalid ID):**
    ```json
    {
      "error": "Patient not found" // or "Invalid patient ID"
    }
    ```

- **Update Patient**
  - **URL:** `PUT /api/patients/:id`
  - **Headers:** 
    - `Content-Type: application/json`
    - `Authorization: Bearer <jwt_token>`
  - **Body:** (partial update allowed)
    ```json
    {
      "address": "456 New Address",
      "phone": "555-9999"
    }
    ```
  - **Response:**
    ```json
    { ...updated_patient_object... }
    ```

- **Delete Patient**
  - **URL:** `DELETE /api/patients/:id`
  - **Headers:** `Authorization: Bearer <jwt_token>`
  - **Response:**
    ```json
    {
      "message": "Patient deleted successfully"
    }
    ```

- **List Patients with Pagination**
  - **URL:** `GET /api/patients?page=1&limit=10`
  - **Headers:** `Authorization: Bearer <jwt_token>`
  - **Response:**
    ```json
    {
      "data": [ ...patient_objects... ],
      "total": 100,
      "page": 1,
      "limit": 10
    }
    ```

- **Transform Patient Data**
  - **URL:** `GET /api/patients/:id/transform?ehr=Athena`
  - **Headers:** `Authorization: Bearer <jwt_token>`
  - **Response:**
    ```json
    {
      "PATIENT_IDENT_NAME": "John Doe",
      "GENDER_OF_PATIENT": "Male",
      "DATE_OF_BIRTH_PATIENT": "1990-01-01T00:00:00.000Z"
    }
    ```

### EHR Mapping Management

- **Create Mapping**
  - **URL:** `POST /api/mappings`
  - **Headers:** 
    - `Content-Type: application/json`
    - `Authorization: Bearer <jwt_token>`
  - **Body:**
    ```json
    {
      "ehr": "Athena",
      "mapping": {
        "name": "PATIENT_IDENT_NAME",
        "gender": "GENDER_OF_PATIENT",
        "dob": "DATE_OF_BIRTH_PATIENT"
      }
    }
    ```
  - **Response:**
    ```json
    {
      "ehr": "Athena",
      "mapping": { ... },
      "message": "Mapping created successfully"
    }
    ```

- **Get Mapping**
  - **URL:** `GET /api/mappings/:ehr`
  - **Headers:** `Authorization: Bearer <jwt_token>`
  - **Response:**
    ```json
    {
      "ehr": "Athena",
      "mapping": { ... }
    }
    ```

- **Update Mapping**
  - **URL:** `PUT /api/mappings/:ehr`
  - **Headers:** 
    - `Content-Type: application/json`
    - `Authorization: Bearer <jwt_token>`
  - **Body:** (update mapping fields)
    ```json
    {
      "mapping": {
        "name": "PATIENT_IDENT_NAME",
        "gender": "GENDER_OF_PATIENT",
        "dob": "DATE_OF_BIRTH_PATIENT",
        "phone": "TELEPHONE_NUMBER_PATIENT"
      }
    }
    ```
  - **Response:**
    ```json
    {
      "ehr": "Athena",
      "mapping": { ... },
      "message": "Mapping updated successfully"
    }
    ```

- **Delete Mapping**
  - **URL:** `DELETE /api/mappings/:ehr`
  - **Headers:** `Authorization: Bearer <jwt_token>`
  - **Response:**
    ```json
    {
      "message": "Mapping deleted successfully"
    }
    ```

---

## Setup & Installation

### Prerequisites

- Node.js (v20 or later recommended)
- npm or yarn
- MongoDB (running locally or via Docker)
- Redis (running locally or via Docker)
- Docker Compose (for running Prometheus, Grafana, and optionally MongoDB/Redis)

### Install

`npm i`

### Starting the server

`npm run dev-ts`

### Running as cluster

`npm run dev-ts-cluster`

### Run docker services

`docker compose up -d`

This will start:

* MongoDB on port `27017`
* Redis on port `6379`
* Prometheus on port `9090`
* Grafana on port `3000`
  
## Tests

Some unit tests were implemented for patient and mapping using Jest inside `src/tests`

## Performing benkmark and stress tests

Grafana's K6 was implemented for load testing.

A sample k6 script (cluster-load-test.js) is provided to test the clustering behavior.

`k6 run cluster-load-test.js`

## Frontend

### Features
- **User Authentication with JWT** (Protected Routes)
- **Patient Management** (CRUD operations)
- **EHR Mappings** (Create, View, Edit, Delete)
- **React Bootstrap UI**
- **React Hook Form for validation**
- **REST API Integration**


### Install

`npm i`

### Starting the dev server

`npm run dev`
