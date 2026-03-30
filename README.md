Welfare Shield A Public Fund Monitoring Dashboard Prototype

Welfare Shield is a frontend prototype designed to demonstrate how data visualization and anomaly indicators can be used to monitor potential fund leakage in public welfare systems.

This version of the project focuses on the user interface and conceptual workflow. All datasets used in the application are simulated for demonstration purposes. The backend services and machine learning models described are part of the proposed architecture and are not implemented in this version.

Project Objective

The objective of Welfare Shield is to present a clear and actionable visual interface that enables officials to:

Identify high-risk regions through heatmap visualization

Drill down into village-level anomaly indicators

View structured evidence summaries

Prioritize potential investigation areas

The project demonstrates how complex welfare disbursement data could be translated into intuitive visual insights.

Current Scope

This repository contains:

A fully developed frontend dashboard

Simulated welfare disbursement datasets

Mock anomaly detection outputs

Static risk scoring indicators

The backend, database integration, and machine learning models are conceptual and not executed in this implementation.

Features Risk Heatmap Visualization

Displays region-level risk intensity using predefined simulated data.

Drill-Down Capability

Allows navigation from district-level view to village-level anomaly summaries.

Risk Categorization

Regions are categorized as:

Low Risk

Medium Risk

High Risk

Evidence View (Simulated)

Provides structured summaries of:

Linked beneficiary accounts

Shared identifiers

Transaction timeline examples

All outputs are generated using mock data to simulate real-world detection scenarios.

Technical Stack

Frontend

React

Tailwind CSS

Data

Simulated datasets (JSON / static data structures)

No backend services or APIs are connected in this version.

Proposed Architecture

Future versions may include:

Backend

FastAPI for API services

Machine Learning

XGBoost for classification

Density-based anomaly detection

Temporal and geospatial analysis

Database

PostgreSQL with PostGIS

These components are part of the system vision but are not implemented in this prototype.

#Future Work#

Implement backend API services

Integrate real or anonymized datasets

Develop and train anomaly detection models

Enable real-time risk scoring

Add authentication and role-based access

Purpose

Welfare Shield serves as a proof-of-concept interface demonstrating how welfare fund monitoring systems could be designed to improve transparency, audit efficiency, and governance visibility.

#login credentials# email: 'admin@gov.in', password: 'password123' email: 'auditor@gov.in', password: 'password123' email: 'officer@gov.in', password: 'password123'
