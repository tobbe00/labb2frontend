// src/PatientJournal.js
import React from 'react';
import { useParams } from 'react-router-dom';

function PatientJournal() {
    const { id } = useParams();

    return (
        <div>
            <h2>Patient Journal for Patient ID: {id}</h2>
            <p>Journal entries will be displayed here.</p>
        </div>
    );
}

export default PatientJournal;
