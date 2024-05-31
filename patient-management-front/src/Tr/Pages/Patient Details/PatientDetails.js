import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import './PatientDetails.css';

const PatientDetails = () => {
    const { id } = useParams(); // Extract patient ID from URL
    const [patient, setPatient] = useState(null);

    const [editable, setEditable] = useState(false);
    const [editableMonitor, setEditableMonitor] = useState(false);
    var [illnesses, setIllnesses] = useState([{ name: '', description: '' }]);
    var [medications, setMedications] = useState([{ name: '', description: '' }]);
    var [surgeries, setSurgeries] = useState([{ name: '', description: '' }]);

    var [obesitySurgeries, setObesitySurgeries] = useState([{ surgery: '', surgeryDetails: '' }]);
    var [consultedDepartments, setConsultedDepartments] = useState([{ departmentName: '', departmentDescription: '' }]);

    const [files, setFiles] = useState({});
    const [isChanged, setIsChanged] = useState(false);
    const [categorizedFiles, setCategorizedFiles] = useState({});
    const [periodicMonitoring, setPeriodicMonitoring] = useState({
        month1: { vki: '', ewl: ''},
        month3: { vki: '', ewl: ''},
        month6: { vki: '', ewl: ''},
        month12: { vki: '', ewl: ''}
    });

    const getFiles = () => {
        return files;
    };



    //POST OP
    var [followUpDays, setFollowUpDays] = useState([{
        followUpDate: '',
        pulse: '',
        temperature: '',
        bloodPressure: '',
        oxygenSaturation: '',
        respiratoryRate: ''
    }]);
    var [postOp, setPostOp] = useState({
        postOpLeakTest: false,
        drainRemovalDay: '',
        dietitianConsultation: '',
        dischargeMedications: '',
        dischargeSupplements: '',
    });
    //POST OP 

    const [preOP, setPreOP] = useState({
        plannedSurgeries: '',
        opDate: '',
        responsibleSurgeon: '',
        assistantSurgeon: '',
        hospital: '',
        nurse: '',
        anesthesiologist: '',
        targetWeight: '',
        anesthesiaNurse: ''
    });

    //Monitoring
    const [monitoring, setMonitoring] = useState({
        patientState: '',
        patientMonitoring: ''
    });

    const [isChangeMonitoring, setChangeMonitoring] = useState(false);
    const [isAdding, setIsAdding] = useState(false);
    const [isEditedFollowUp, setIsEditedFollowUp] = useState(false);
    const [isEdited, setIsEdited] = useState(false);
    const [isEditedFollow, setIsEditedFollow] = useState(false);

    //OP PROCESS
    const [OpProcessData, setOpProcessData] = useState({
        materials: '',
        isIntraop: false,
        isDiren: false
    });

    //OP PROCESS


    useEffect(() => {
        // Fetch patient data from server using the patient ID
        fetch(`https://localhost:7050/patients/${id}`)
            .then(response => response.json())
            .then(data => setPatient(data))
            .catch(error => console.error('Error fetching patient data:', error));

        fetch(`https://localhost:7050/GetIllnesses/${id}`)
            .then(response => response.json())
            .then(data => setIllnesses(data))
            .catch(error => console.error('Error fetching medical history data:', error));

        fetch(`https://localhost:7050/GetMedications/${id}`)
            .then(response => response.json())
            .then(data => setMedications(data))
            .then(console.log(medications))
            .catch(error => console.error('Error fetching medical history data:', error));

        fetch(`https://localhost:7050/GetSurgeries/${id}`)
            .then(response => response.json())
            .then(data => setSurgeries(data))
            .catch(error => console.error('Error fetching medical history data:', error));

        fetch(`https://localhost:7050/GetObesitySurgeries/${id}`)
            .then(response => response.json())
            .then(data => setObesitySurgeries(data))
            .catch(error => console.error('Error fetching PreOP data:', error));

        fetch(`https://localhost:7050/GetDepartments/${id}`)
            .then(response => response.json())
            .then(data => setConsultedDepartments(data))
            .catch(error => console.error('Error fetching PreOP data:', error));

        fetch(`https://localhost:7050/GetPreOP/${id}`)
            .then(response => response.json())
            .then(data => setPreOP(data))
            .catch(error => console.error('Error fetching PreOP data:', error));

        fetch(`https://localhost:7050/GetOPProcess/${id}`)
            .then(response => response.json())
            .then(fetchedData => {
                setOpProcessData(fetchedData);
                console.log(fetchedData); // Doğru yerde loglama yapılıyor
            })
            .catch(error => {
                console.error('Error fetching op process:', error);
            });
        fetch(`https://localhost:7050/GetPostOP/${id}`)
            .then(response => response.json())
            .then(fetchedData => {
                setPostOp(fetchedData);
                console.log(fetchedData);
            })
            .catch(error => {
                console.error('Error fetching post op:', error);
            });
        fetch(`https://localhost:7050/GetFollowUpDays/${id}`)
            .then(response => response.json())
            .then(fetchedData => {
                const processedData = fetchedData.map(day => ({
                    ...day,
                    followUpDate: day.followUpDate.split('T')[0]  // "2024-05-23T00:00:00" -> "2024-05-23"
                }));

                setFollowUpDays(processedData);
                //setFollowUpDays(fetchedData);
                console.log(fetchedData);
            })
            .catch(error => {
                console.error('Error fetching followup days:', error);
            });
        fetch(`https://localhost:7050/GetMonitoring/${id}`)
            .then(response => response.json())
            .then(fetchedData => {
                setMonitoring(fetchedData);
                console.log(fetchedData);
            })
            .catch(error => {
                console.error('Error fetching monitoring:', error);
            });

        fetch(`https://localhost:7050/files/${id}`)
            .then(response => response.json())
            .then(data => {
                categorizeFiles(data);
            })
            .catch(error => console.error('Error fetching files:', error));

    }, [id]); // Fetch data whenever the ID changes

    useEffect(() => {
        const hasChanges = Object.keys(files).length > 0;
        setIsChanged(hasChanges);
    }, [files]);

    const handleAddMedication = () => {
        setMedications([...medications, { name: '', description: '' }]);
    };

    const handleRemoveMedication = index => {
        const confirmation = window.confirm("Seçili ilacı silmek istediğinize emin misiniz?");
        if (confirmation) {
            const list = [...medications];
            list.splice(index, 1);
            setMedications(list);
        }
    };

    const handleMedicationChange = (index, event) => {
        const { name, value } = event.target;
        const list = [...medications];
        list[index][name] = value;
        setMedications(list);
    };

    const handleAddSurgery = () => {
        setSurgeries([...surgeries, { name: '', description: '' }]);
    };

    const handleRemoveSurgery = index => {
        const confirmation = window.confirm("Seçili ameliyatı silmek istediğinize emin misiniz?");
        if (confirmation) {
            const list = [...surgeries];
            list.splice(index, 1);
            setSurgeries(list);
        }
    };

    const handleSurgeryChange = (index, event) => {
        const { name, value } = event.target;
        const list = [...surgeries];
        list[index][name] = value;
        setSurgeries(list);
    };
    const handleAddObesitySurgery = () => {
        setObesitySurgeries([...obesitySurgeries, { surgery: '', surgeryDetails: '' }]);
    };

    const handleAddConsultedDepartment = () => {
        setConsultedDepartments([...consultedDepartments, { departmentName: '', departmentDescription: '' }]);
    };

    const handleRemoveObesitySurgery = index => {
        const confirmation = window.confirm("Seçili ameliyat türünü silmek istediğinize emin misiniz?");
        if (confirmation) {
            const list = [...obesitySurgeries];
            list.splice(index, 1);
            setObesitySurgeries(list);
        }
    };

    const handleRemoveConsultedDepartment = index => {
        const confirmation = window.confirm("Seçili bölümü silmek istediğinize emin misiniz?");
        if (confirmation) {
            const list = [...consultedDepartments];
            list.splice(index, 1);
            setConsultedDepartments(list);
        }
    };

    //POST OP Change
    const handleFollowUpDaysChange = (index, event) => {
        const { name, value } = event.target;
        const list = [...surgeries];
        list[index][name] = value;
        setFollowUpDays(list);
    };


    //FollowUp 
    const [newFollowUp, setNewFollowUp] = useState({
        followUpDate: '',
        pulse: '',
        temperature: '',
        bloodPressure: '',
        oxygenSaturation: '',
        respiratoryRate: ''
    });
    const handleFollowUpChange = (index, field, value) => {
        const updatedFollowUpDays = [...followUpDays];
        updatedFollowUpDays[index] = {
            ...updatedFollowUpDays[index],
            [field]: value,
        };
        setFollowUpDays(updatedFollowUpDays);
        setIsEditedFollow(true);
        //setIsAdding(true);
        setIsEditedFollowUp(true);
    };

    const handleFollowUpNewChange = (field, value) => {
        setNewFollowUp({
            ...newFollowUp,
            [field]: value,
        });

    };

    const handleFollowUpSave = () => {

        const dataToSave = isAdding ? [...followUpDays, newFollowUp] : followUpDays;
        console.log(dataToSave);
        console.log('bitti');
        fetch(`https://localhost:7050/AddFollowUpDays/${id}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(dataToSave),
        })
            .then(response => response.json())
            .then(data => {
                console.log('Data saved successfully:');
                setFollowUpDays(data);
                setIsEditedFollow(false);
                setIsAdding(false);
                setNewFollowUp({
                    followUpDate: '',
                    pulse: '',
                    temperature: '',
                    bloodPressure: '',
                    oxygenSaturation: '',
                    respiratoryRate: ''
                });
            })
            .catch(error => console.error('Error saving follow-up data:', error));
        setIsAdding(false);
        setIsEditedFollowUp(false);
    };

    const handlePostOpChange = (e) => {
        const { id, type, checked, value } = e.target;
        const newValue = type === 'checkbox' ? checked : value;
        setPostOp(prevState => ({
            ...prevState,
            [id]: newValue
        }));
        setIsEdited(true);
    };

    const handlePostOpSave = () => {
        fetch(`https://localhost:7050/AddPostOP/${id}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(postOp),
        })
            .then(response => response.json())
            .then(data => {
                console.log('Data saved successfully:', data);
                setPostOp(data);
                setIsEdited(false);
                setEditable(true);
            })
            .catch(error => console.error('Error saving post-op data:', error));
        setIsEdited(false);
        setEditable(false);
    };


    const handleSaveChanges = () => {
        // Medical History Saving
        const saveMedicalHistory = (medicalHistoryArray, id) => {
            // Create an array of medical history objects

            // Send the array to the API
            fetch(`https://localhost:7050/AddMedicalHistory/${id}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(medicalHistoryArray)
            })
                .then(response => {
                    if (response.ok) {
                        return response.json();
                    }
                    throw new Error('Network response was not ok.');
                })
                .then(data => console.log(data))
                .catch(error => console.error('Error adding medical history:', error));
        };

        // Filter out the illnesses that do not have a name
        illnesses = illnesses.filter(item => item.name);

        // Check inside the illnesses if there is any empty description and if so, make it '-'. 
        illnesses.forEach(item => {
            if (!item.description) {
                item.description = '-';
            }
        });

        setIllnesses(illnesses);

        medications = medications.filter(item => item.name);

        medications.forEach(item => {
            if (!item.description) {
                item.description = '-';
            }
        });

        setMedications(medications);

        surgeries = surgeries.filter(item => item.name);

        surgeries.forEach(item => {
            if (!item.description) {
                item.description = '-';
            }
        });

        setSurgeries(surgeries);


        var medicalHistoryArray = illnesses.map(item =>
        ({
            PatientId: id,
            HistoryType: "Illness",
            Name: item.name,
            Description: item.description
        }));

        medicalHistoryArray.push(...medications.map(item => ({
            PatientId: id,
            HistoryType: "Medication",
            Name: item.name,
            Description: item.description
        })));

        medicalHistoryArray.push(...surgeries.map(item => ({
            PatientId: id,
            HistoryType: "Surgery",
            Name: item.name,
            Description: item.description
        })));

        var medicalHistoryArray = medicalHistoryArray.filter(item => item.Name);

        saveMedicalHistory(medicalHistoryArray, id);

        // PreOP Saving
        const savePreOP = (preOP, obesitySurgeries, consultedDepartments, id) => {
            // Create an array of medical history objects

            fetch(`https://localhost:7050/AddPreOP/${id}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(preOP)
            })
                .then(response => {
                    if (response.ok) {
                        return response.json();
                    }
                    throw new Error('Network response was not ok.');
                })
                .then(data => console.log(data))
                .catch(error => console.error('Error adding PreOP:', error));

            fetch(`https://localhost:7050/AddObesitySurgery/${id}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(obesitySurgeries)
            })
                .then(response => {
                    if (response.ok) {
                        return response.json();
                    }
                    throw new Error('Network response was not ok.');
                })
                .then(data => console.log(data))
                .catch(error => console.error('Error adding PreOP:', error));

            fetch(`https://localhost:7050/AddDepartment/${id}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(consultedDepartments)
            })
                .then(response => {
                    if (response.ok) {
                        return response.json();
                    }
                    throw new Error('Network response was not ok.');
                })
                .then(data => console.log(data))
                .catch(error => console.error('Error adding PreOP:', error));
        };

        obesitySurgeries = obesitySurgeries.filter(item => item.surgery);

        obesitySurgeries.forEach(item => {
            if (!item.surgeryDetails) {
                item.surgeryDetails = '-';
            }
        });

        var obesitySurgeriesArray = obesitySurgeries.map(item =>
        ({
            Surgery: item.surgery,
            SurgeryDetails: item.surgeryDetails
        }));

        consultedDepartments = consultedDepartments.filter(item => item.departmentName);

        consultedDepartments.forEach(item => {
            if (!item.departmentDescription) {
                item.departmentDescription = '-';
            }
        });

        var consultedDepartmentsArray = consultedDepartments.map(item =>
        ({
            DepartmentName: item.departmentName,
            DepartmentDescription: item.departmentDescription
        }));

        savePreOP(preOP, obesitySurgeriesArray, consultedDepartmentsArray, id);

        setConsultedDepartments(consultedDepartments);
        setObesitySurgeries(obesitySurgeries);

        setEditable(false);
    };

    const handleToggleEdit = () => {
        setEditable(!editable);
    };

    const handleEditMonitor = () => {
        setEditableMonitor(!editableMonitor);
    }
    const handleObesitySurgeryChange = (index, event) => {
        const { name, value } = event.target;
        const list = [...obesitySurgeries];
        list[index][name] = value;
        setObesitySurgeries(list);
    };

    const handleConsultedDepartmentChange = (index, event) => {
        const { name, value } = event.target;
        const list = [...consultedDepartments];
        list[index][name] = value;
        setConsultedDepartments(list);
    };

    const handleAddIllness = () => {
        setIllnesses([...illnesses, { name: '', description: '' }]);
    };

    const handleRemoveIllness = index => {
        const confirmation = window.confirm("Seçili hastalığı silmek istediğinize emin misiniz?");
        if (confirmation) {
            const list = [...illnesses];
            list.splice(index, 1);
            setIllnesses(list);
        }

    };

    const handleIllnessChange = (index, event) => {
        const { name, value } = event.target;
        const list = [...illnesses];
        list[index][name] = value;
        setIllnesses(list);
    };

    // Handle OP Process
    const handleOPProcessChange = (e) => {
        const { name, value, type, checked } = e.target;
        setOpProcessData(prevState => ({
            ...prevState,
            [name]: type === 'checkbox' ? checked : value
        }));
        setIsModified(true);
    };
    //op process ismodified
    const [isModified, setIsModified] = useState(false);

    const saveOPProcess = () => {
        fetch(`https://localhost:7050/AddOPProcess/${id}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(OpProcessData)
        })
            .then(response => {
                if (response.ok) {
                    console.log('Success: Operation process updated successfully.');
                    setIsModified(false);
                } else {
                    console.error('Error updating op process: ', response.statusText);
                }
            })
            .catch(error => {
                console.error('Error updating op process:', error);
            });
    };



    //monitoring save add
    const handleMonitoringChange = (e) => {
        const { name, value } = e.target;
        setMonitoring(prevState => ({
            ...prevState,
            [name]: value
        }));
        setChangeMonitoring(true); // Değişiklik yapıldığında true olacak
    };
    const saveMonitoring = () => {
        fetch(`https://localhost:7050/AddMonitoring/${id}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(monitoring)
        })
            .then(response => {
                if (response.ok) {
                    console.log('Success: Monitoring successfully.');
                    setChangeMonitoring(false);
                } else {
                    console.error('Error updating monitoring: ', response.statusText);
                }
            })
            .catch(error => {
                console.error('Error updating monitoring:', error);
            });
        setEditableMonitor(false);
    };

    //Periodic Monitoring

    // Function to handle file change
    const handleFileChange = (event, fileType, month) => {
        const files = event.target.files;
        if (files.length > 0) {
            setCategorizedFiles(prevFiles => {
                const newFiles = { ...prevFiles };
                if (!newFiles[month]) {
                    newFiles[month] = {};
                }
                newFiles[month][fileType] = {
                    file: files[0],
                    name: files[0].name
                };
                return newFiles;
            });
            setFiles(prevFiles => ({
                ...prevFiles,
                [`${month}/${fileType}`]: files[0]
            }));

            setIsChanged(true);
        }
    };
    

    // Function to save periodic monitoring
    const savePeriodicMonitoring = async () => {
        const files = getFiles();

        for (const filePath in files) {
            const file = files[filePath];

            const formData = new FormData();
            formData.append('file', file);

            const [category, fileType] = filePath.split('/');
        
            formData.append('category', category);
            formData.append('fileType', fileType);

            try {
                const response = await fetch(`https://localhost:7050/upload/${id}`, {
                    method: 'POST',
                    body: formData
                });

                if (!response.ok) {
                    throw new Error('File upload failed');
                }

                const result = await response.text();
                console.log(result);
            } catch (error) {
                console.error('Error uploading file:', error);
            }
        }

        setIsChanged(false);
    };

    // Function to download the file
    const downloadFile = (fileType, month) => {
        fetch(`https://localhost:7050/download/${id}?category=${month}&fileType=${fileType}`)
            .then(response => {
                if (response.ok) {
                    const contentDisposition = response.headers.get('Content-Disposition');
                    let filename = `${fileType}-${month}.dat`;
    
                    if (contentDisposition && contentDisposition.includes('filename=')) {
                        const matches = contentDisposition.match(/filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/i);
                        if (matches != null && matches[1]) {
                            filename = matches[1].replace(/['"]/g, '');
                            filename = decodeURIComponent(filename.replace(/UTF-8''/, ''));
                        }
                    }
    
                    return response.blob().then(blob => ({ blob, filename }));
                } else {
                    throw new Error('File download failed');
                }
            })
            .then(({ blob, filename }) => {
                if (blob.size === 0) {
                    throw new Error('Önce değişiklikleri kaydetmeniz gerekmektedir.');
                }
    
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = filename;
                document.body.appendChild(a);
                a.click();
                a.remove();
            })
            .catch(error => {
                console.error('Error downloading file:', error);
                alert(error.message); // Show an error message to the user
            });
    };
    

    // Function to remove the file
    const removeFile = (fileType, month) => {
        fetch(`https://localhost:7050/delete/${id}?category=${month}&fileType=${fileType}`, {
            method: 'DELETE'
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('File deletion failed');
                }
                setCategorizedFiles(prevFiles => {
                    const newFiles = { ...prevFiles };
                    delete newFiles[month][fileType];
                    if (Object.keys(newFiles[month]).length === 0) {
                        delete newFiles[month];
                    }
                    return newFiles;
                });
                
                setFiles(prevFiles => {
                    const newFiles = { ...prevFiles };
                    delete newFiles[`${month}/${fileType}`];
                    return newFiles;
                });
            })
            .catch(error => {
                console.error('Error deleting file:', error);
            });
    };    

    // Function to check file availability
    const checkFileAvailability = (data) => {
        const hasFiles = data.some(item => item.file);
        setIsChanged(hasFiles);
    };

    // Function to handle periodic monitoring change
    const handlePeriodicMonitoringChange = (e) => {
        const { name, value } = e.target;
        const [field, month] = name.split('-');
        setPeriodicMonitoring(prevState => ({
            ...prevState,
            [`month${month}`]: {
                ...prevState[`month${month}`],
                [field]: value
            }
        }));
    };

    // Function to categorize files
    const categorizeFiles = (files) => {
        const categories = {};

        files.forEach(filePath => {
            const [month, fileType, fileName] = filePath.split('/');
            if (!categories[month]) {
                categories[month] = {};
            }
            categories[month][fileType] = fileName;
        });

        setCategorizedFiles(categories);
    };
    
    // Function to render file link or input
    const renderFileLink = (month, fileType) => {
        const file = categorizedFiles[month]?.[fileType];
        const fileName = typeof file === 'string' ? file : file?.name; // Ensure fileName is a string
    
        return fileName ? (
            <div className="mb-3 mt-3">
                <span>{fileName}</span>
                <button className="btn btn-primary ms-2" onClick={() => downloadFile(fileType, month)}>Download</button>
                <button className="btn btn-danger ms-2" onClick={() => removeFile(fileType, month)}>Remove</button>
            </div>
        ) : (
            <input type="file" className="form-control-file" onChange={(e) => handleFileChange(e, fileType, month)} />
        );
    };
    
    



    return (
        <div>
            {/* ======= Header ======= */}
            <header id="header" className="header fixed-top d-flex align-items-center">
                <div className="d-flex align-items-center justify-content-between">
                    <a href="index.html" className="logo d-flex align-items-center">
                        <img src="/assets/img/logo.png" />
                        <span className="d-none d-lg-block">Patient Management</span>
                    </a>
                    <i className="bi bi-list toggle-sidebar-btn" />
                </div>{/* End Logo */}
                <nav className="header-nav ms-auto">
                    <ul className="d-flex align-items-center">
                        <li className="nav-item d-block d-lg-none">
                            <a className="nav-link nav-icon search-bar-toggle " href="#">
                                <i className="bi bi-search" />
                            </a>
                        </li>{/* End Search Icon*/}
                        <li className="nav-item dropdown pe-3">
                            <a className="nav-link nav-profile d-flex align-items-center pe-0" href="#" data-bs-toggle="dropdown">
                                <img src="/assets/img/profile-img.jpg" alt="Profile" className="rounded-circle" />
                                <span className="d-none d-md-block dropdown-toggle ps-2">K. Anderson</span>
                            </a>{/* End Profile Image Icon */}
                            <ul className="dropdown-menu dropdown-menu-end dropdown-menu-arrow profile">
                                <li className="dropdown-header">
                                    <h6>Kevin Anderson</h6>
                                    <span>Web Designer</span>
                                </li>
                                <li>
                                    <hr className="dropdown-divider" />
                                </li>
                                <li>
                                    <a className="dropdown-item d-flex align-items-center" href="users-profile.html">
                                        <i className="bi bi-person" />
                                        <span>My Profile</span>
                                    </a>
                                </li>
                                <li>
                                    <hr className="dropdown-divider" />
                                </li>
                                <li>
                                    <a className="dropdown-item d-flex align-items-center" href="users-profile.html">
                                        <i className="bi bi-gear" />
                                        <span>Account Settings</span>
                                    </a>
                                </li>
                                <li>
                                    <hr className="dropdown-divider" />
                                </li>
                                <li>
                                    <a className="dropdown-item d-flex align-items-center" href="pages-faq.html">
                                        <i className="bi bi-question-circle" />
                                        <span>Need Help?</span>
                                    </a>
                                </li>
                                <li>
                                    <hr className="dropdown-divider" />
                                </li>
                                <li>
                                    <a className="dropdown-item d-flex align-items-center" href="#">
                                        <i className="bi bi-box-arrow-right" />
                                        <span>Sign Out</span>
                                    </a>
                                </li>
                            </ul>{/* End Profile Dropdown Items */}
                        </li>{/* End Profile Nav */}
                    </ul>
                </nav>{/* End Icons Navigation */}
            </header>{/* End Header */}
            {/* ======= Sidebar ======= */}
            <aside id="sidebar" className="sidebar">
                <ul className="sidebar-nav" id="sidebar-nav">
                    <li className="nav-item">
                        <a className="nav-link collapsed" href="/tr/patients">
                            <i className="bi bi-person" />
                            <span>Hastalar</span>
                        </a>
                    </li>
                    <li className="nav-item">
                        <a className="nav-link" href="#">
                            <i className="bi bi-person" />
                            <span>Hasta Profili</span>
                        </a>
                    </li>
                    <li className="nav-item">
                        <a className="nav-link collapsed" href="/tr/login-form">
                            <i className="bi bi-box-arrow-in-right" />
                            <span>Çıkış Yap</span>
                        </a>
                    </li>
                </ul>
            </aside>
            {/* ======= Sidebar End ======= */}
            <main id="main" className="main">
                <div className="pagetitle">
                    <div className="row align-items-center">
                        <div className="col-auto">
                            {/* Add the image here */}
                            <img src="/assets/img/profile-img.jpg" alt="Profile" className="rounded-circle" style={{ width: 60, height: 60 }} />
                        </div>
                        <div className="col">
                            {patient ? (
                                <><div className="row align-items-center">
                                    <div className="col-auto">
                                        <a className="nav-link nav-profile d-flex align-items-center pe-0">
                                            <span className="d-none d-md-block">{patient.name} {patient.surname}</span>
                                        </a>{/* End Profile Image Icon */}
                                    </div>
                                </div>
                                    <div className="row mt-1">

                                        <div className="col-auto">
                                            <h6><strong>Yaş:</strong> {patient.age}</h6>
                                        </div><div className="col">
                                            <h6><strong>BMI:</strong> {patient.bmi}</h6>
                                        </div>

                                    </div></>
                            ) : (
                                <p>Loading...</p>
                            )}
                        </div>
                    </div>
                </div>{/* End Page Title */}
                <section className="section profile">
                    <div className="row">
                        {/* <div class="col-xl-4">

            <div class="card">
                <div class="card-body profile-card pt-4 d-flex flex-column align-items-center">

                <img src="/assets/img/profile-img.jpg" alt="Profile" class="rounded-circle">
                <h2>Mustafa Dereci</h2>
                <h3>Male</h3>
                </div>
            </div>

            </div> */}
                        <div className="col-xl-12">
                            <div className="card">
                                <div className="card-body pt-3">
                                    {/* Bordered Tabs */}
                                    <ul className="nav nav-tabs nav-tabs-bordered">
                                        <li className="nav-item">
                                            <button className="nav-link active" data-bs-toggle="tab" data-bs-target="#profile-overview">Genel Bakış</button>
                                        </li>
                                        <li className="nav-item">
                                            <button className="nav-link" data-bs-toggle="tab" data-bs-target="#medical-history">Tıbbi Geçmiş</button>
                                        </li>
                                        <li className="nav-item">
                                            <button className="nav-link" data-bs-toggle="tab" data-bs-target="#planned-operation">PreOP</button>
                                        </li>
                                        <li className="nav-item">
                                            <button className="nav-link" data-bs-toggle="tab" data-bs-target="#operation-process">OP Süreci</button>
                                        </li>
                                        <li className="nav-item">
                                            <button className="nav-link" data-bs-toggle="tab" data-bs-target="#post-operation">PostOP</button>
                                        </li>
                                        <li className="nav-item">
                                            <button className="nav-link" data-bs-toggle="tab" data-bs-target="#monitoring">İzleme</button>
                                        </li>
                                    </ul>
                                    <div className="tab-content pt-2">
                                        <div className="tab-pane fade show active profile-overview" id="profile-overview">
                                            {patient ? (
                                                <div className="row mb-3">
                                                    <div className="col-lg-6">
                                                        <h5 className="card-title">Demografik Bilgiler</h5>
                                                        <div className="row">
                                                            <div className="col-lg-3 col-md-4 label">Yaş</div>
                                                            <div className="col-lg-9 col-md-8">{patient.age}</div>
                                                        </div>
                                                        <div className="row">
                                                            <div className="col-lg-3 col-md-4 label">Cinsiyet</div>
                                                            <div className="col-lg-9 col-md-8">{patient.sex === 1 ? 'Male' : 'Female'}</div>
                                                        </div>
                                                        <div className="row">
                                                            <div className="col-lg-3 col-md-4 label">Ad</div>
                                                            <div className="col-lg-9 col-md-8">{patient.name}</div>
                                                        </div>
                                                        <div className="row">
                                                            <div className="col-lg-3 col-md-4 label">Soyad</div>
                                                            <div className="col-lg-9 col-md-8">{patient.surname}</div>
                                                        </div>
                                                        <div className="row">
                                                            <div className="col-lg-3 col-md-4 label">Telefon</div>
                                                            <div className="col-lg-9 col-md-8">{patient.phone}</div>
                                                        </div>
                                                        <div className="row">
                                                            <div className="col-lg-3 col-md-4 label">Adres</div>
                                                            <div className="col-lg-9 col-md-8">{patient.address}</div>
                                                        </div>
                                                    </div>
                                                    <div className="col-lg-6">
                                                        <h5 className="card-title">Antropometrik Bilgiler</h5>
                                                        <div className="row">
                                                            <div className="col-lg-3 col-md-4 label">Boy</div>
                                                            <div className="col-lg-9 col-md-8">{patient.size} cm</div>
                                                        </div>
                                                        <div className="row">
                                                            <div className="col-lg-3 col-md-4 label">Kilo</div>
                                                            <div className="col-lg-9 col-md-8">{patient.weight} kg</div>
                                                        </div>
                                                        <div className="row">
                                                            <div className="col-lg-3 col-md-4 label">BMI</div>
                                                            <div className="col-lg-9 col-md-8">{patient.bmi}</div>
                                                        </div>
                                                        <div className="row">
                                                            <div className="col-lg-3 col-md-4 label">Vücut Kütlesi</div>
                                                            <div className="col-lg-9 col-md-8">{patient.bodyMass}</div>
                                                        </div>
                                                    </div>

                                                </div>
                                            ) : (
                                                <p>Yükleniyor...</p>
                                            )}
                                            {/* Hidden form for editing */}
                                            <form className="hidden-form">
                                                {/* Form fields for editing demographic information */}
                                            </form>
                                        </div>

                                        <div className="tab-pane fade profile-overview pt-3" id="medical-history">
                                            <div className="row mb-3">
                                                <div className="col-lg-11">
                                                    <h5 className="card-title">Hastalık Listesi</h5>
                                                    {illnesses.map((illness, index) => (
                                                        <div className="row mb-3" key={index}>
                                                            <div className="col-lg-6">
                                                                <input
                                                                    type="text"
                                                                    className="form-control"
                                                                    value={illness.name}
                                                                    placeholder="Hastalık Adı"
                                                                    name="name"
                                                                    onChange={e => handleIllnessChange(index, e)}
                                                                    disabled={!editable}
                                                                />
                                                            </div>
                                                            <div className="col-lg-4">
                                                                <input
                                                                    type="text"
                                                                    className="form-control"
                                                                    value={illness.description}
                                                                    placeholder="Açıklama"
                                                                    name="description"
                                                                    onChange={e => handleIllnessChange(index, e)}
                                                                    disabled={!editable}
                                                                />
                                                            </div>
                                                            <div className="col-lg-2">
                                                                {editable && <button className="btn btn-danger btn-sm" onClick={() => handleRemoveIllness(index)}>Kaldır</button>}
                                                            </div>
                                                        </div>
                                                    ))}
                                                    {editable && <button className="btn btn-primary btn-sm" onClick={handleAddIllness}>Hastalık Ekle</button>}
                                                </div>
                                                {!editable && (
                                                    <div className="col-lg-1">
                                                        <div className="btn-group text-end">
                                                            <button className="btn btn-primary btn-sm edit-btn" title="Edit" onClick={handleToggleEdit}>
                                                                <i className="ri ri-edit-2-fill" />
                                                            </button>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                            <div className="row mb-3">
                                                <div className="col-lg-11">
                                                    <h5 className="card-title">İlaç Kullanımı</h5>
                                                    {medications.map((medication, index) => (
                                                        <div className="row mb-3" key={index}>
                                                            <div className="col-lg-6">
                                                                <input
                                                                    type="text"
                                                                    className="form-control"
                                                                    value={medication.name}
                                                                    placeholder="İlaç Adı"
                                                                    name="name"
                                                                    onChange={e => handleMedicationChange(index, e)}
                                                                    disabled={!editable}
                                                                />
                                                            </div>
                                                            <div className="col-lg-4">
                                                                <input
                                                                    type="text"
                                                                    className="form-control"
                                                                    value={medication.description}
                                                                    placeholder="Dozaj"
                                                                    name="description"
                                                                    onChange={e => handleMedicationChange(index, e)}
                                                                    disabled={!editable}
                                                                />
                                                            </div>
                                                            <div className="col-lg-2">
                                                                {editable && <button className="btn btn-danger btn-sm" onClick={() => handleRemoveMedication(index)}>Kaldır</button>}
                                                            </div>
                                                        </div>
                                                    ))}
                                                    {editable && <button className="btn btn-primary btn-sm" onClick={handleAddMedication}>İlaç Ekle</button>}
                                                </div>
                                            </div>
                                            <div className="row mb-3">
                                                <div className="col-lg-11">
                                                    <h5 className="card-title">Ameliyat Geçmişi</h5>
                                                    {surgeries.map((surgery, index) => (
                                                        <div className="row mb-3" key={index}>
                                                            <div className="col-lg-6">
                                                                <input
                                                                    type="text"
                                                                    className="form-control"
                                                                    value={surgery.name}
                                                                    placeholder="Ameliyat Adı"
                                                                    name="name"
                                                                    onChange={e => handleSurgeryChange(index, e)}
                                                                    disabled={!editable}
                                                                />
                                                            </div>
                                                            <div className="col-lg-4">
                                                                <input
                                                                    type="text"
                                                                    className="form-control"
                                                                    value={surgery.description}
                                                                    placeholder="Açıklama"
                                                                    name="description"
                                                                    onChange={e => handleSurgeryChange(index, e)}
                                                                    disabled={!editable}
                                                                />
                                                            </div>
                                                            <div className="col-lg-2">
                                                                {editable && <button className="btn btn-danger btn-sm" onClick={() => handleRemoveSurgery(index)}>Kaldır</button>}
                                                            </div>
                                                        </div>
                                                    ))}
                                                    {editable && <button className="btn btn-primary btn-sm" onClick={handleAddSurgery}>Ameliyat Ekle</button>}
                                                </div>
                                            </div>
                                            {/* Save Changes Button */}
                                            {editable && <button className="btn btn-success" onClick={handleSaveChanges}>Değişiklikleri Kaydet</button>}
                                        </div>


                                        <div className="tab-pane fade profile-overview pt-3" id="planned-operation">
                                            <div className="row mb-3">
                                                <div className="col-lg-11">
                                                    <h5 className="card-title">Planlanan Operasyon (PREOP Süreci)</h5>
                                                </div>
                                                <div className="col-lg-1">
                                                    {!editable && (
                                                        <div className="btn-group text-end">
                                                            <button className="btn btn-primary btn-sm edit-btn" title="Edit" onClick={handleToggleEdit}>
                                                                <i className="ri ri-edit-2-fill" />
                                                            </button>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                            {/* Types of Obesity Surgery */}
                                            <div className="row mb-3">
                                                <div className="col-lg-12">
                                                    <h6 className="label">Obezite Ameliyatı Türleri</h6>
                                                    {obesitySurgeries.map((Obsurgery, index) => (
                                                        <div className="row mb-3" key={index}>
                                                            <div className="col-lg-6">
                                                                <input
                                                                    type="text"
                                                                    className="form-control"
                                                                    name="surgery"
                                                                    value={Obsurgery.surgery}
                                                                    onChange={e => handleObesitySurgeryChange(index, e)}
                                                                    placeholder="Tür"
                                                                    disabled={!editable}
                                                                />
                                                            </div>
                                                            <div className="col-lg-4">
                                                                <input
                                                                    type="text"
                                                                    className="form-control"
                                                                    name="surgeryDetails"
                                                                    value={Obsurgery.surgeryDetails}
                                                                    onChange={e => handleObesitySurgeryChange(index, e)}
                                                                    placeholder="Açıklama"
                                                                    disabled={!editable}
                                                                />
                                                            </div>
                                                            <div className="col-lg-2">
                                                                {editable && <button className="btn btn-danger btn-sm" onClick={() => handleRemoveObesitySurgery(index)}>Kaldır</button>}
                                                            </div>
                                                        </div>
                                                    ))}
                                                    {editable && <button className="btn btn-primary btn-sm" onClick={handleAddObesitySurgery}>Ameliyat Ekle</button>}
                                                </div>
                                            </div>
                                            {/* Consulted Departments Preoperatively */}
                                            <div className="row mb-3">
                                                <div className="col-lg-12">
                                                    <h6 className="label">Ameliyat Öncesi Danışılan Bölümler</h6>
                                                    {consultedDepartments.map((department, index) => (
                                                        <div className="row mb-3" key={index}>
                                                            <div className="col-lg-6">
                                                                <input
                                                                    type="text"
                                                                    className="form-control"
                                                                    name="departmentName"
                                                                    value={department.departmentName}
                                                                    onChange={e => handleConsultedDepartmentChange(index, e)}
                                                                    placeholder="Bölüm"
                                                                    disabled={!editable}
                                                                />
                                                            </div>
                                                            <div className="col-lg-4">
                                                                <input
                                                                    type="text"
                                                                    className="form-control"
                                                                    name="departmentDescription"
                                                                    value={department.departmentDescription}
                                                                    onChange={e => handleConsultedDepartmentChange(index, e)}
                                                                    placeholder="Açıklama"
                                                                    disabled={!editable}
                                                                />
                                                            </div>
                                                            <div className="col-lg-2">
                                                                {editable && <button className="btn btn-danger btn-sm" onClick={() => handleRemoveConsultedDepartment(index)}>Kaldır</button>}
                                                            </div>
                                                        </div>
                                                    ))}
                                                    {editable && <button className="btn btn-primary btn-sm" onClick={handleAddConsultedDepartment}>Bölüm Ekle</button>}
                                                </div>
                                            </div>
                                            {/* Target Weight and Additional Planned Surgeries */}
                                            <div className="row mb-3 mt-4">
                                                <div className="col-lg-6">
                                                    <h6 className="label">Hedeflenen Kilo</h6>
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        name="targetWeight"
                                                        value={preOP.targetWeight}
                                                        onChange={e => setPreOP({ ...preOP, targetWeight: e.target.value })}
                                                        placeholder="Kilo"
                                                        disabled={!editable}
                                                    />
                                                </div>
                                                <div className="col-lg-6">
                                                    <h6 className="label">Ek Planlanan Ameliyatlar</h6>
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        name="plannedSurgeries"
                                                        value={preOP.plannedSurgeries}
                                                        onChange={e => setPreOP({ ...preOP, plannedSurgeries: e.target.value })}
                                                        placeholder="Ek planlanan ameliyatlar eklenecek"
                                                        disabled={!editable}
                                                    />
                                                </div>
                                            </div>

                                            <div className="row mb-3 mt-5">
                                                <div className="col-lg-12">
                                                    <h5 className="label">Ameliyat Detayları</h5>
                                                </div>
                                            </div>

                                            <div className="row mb-3">
                                                <div className="col-lg-3">
                                                    <p><strong>Planlanan Ameliyat Tarihleri:</strong></p>
                                                </div>
                                                <div className="col-lg-9">
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        name="opDate"
                                                        value={preOP.opDate}
                                                        onChange={e => setPreOP({ ...preOP, opDate: e.target.value })}
                                                        placeholder="Planlanan ameliyat tarihleri"
                                                        disabled={!editable}
                                                    />
                                                </div>
                                            </div>

                                            <div className="row mb-3">
                                                <div className="col-lg-3">
                                                    <p><strong>Sorumlu Cerrah:</strong></p>
                                                </div>
                                                <div className="col-lg-9">
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        name="responsibleSurgeon"
                                                        value={preOP.responsibleSurgeon}
                                                        onChange={e => setPreOP({ ...preOP, responsibleSurgeon: e.target.value })}
                                                        placeholder="Sorumlu cerrah"
                                                        disabled={!editable}
                                                    />
                                                </div>
                                            </div>

                                            <div className="row mb-3">
                                                <div className="col-lg-3">
                                                    <p><strong>Yardımcı Cerrah:</strong></p>
                                                </div>
                                                <div className="col-lg-9">
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        name="assistantSurgeon"
                                                        value={preOP.assistantSurgeon}
                                                        onChange={e => setPreOP({ ...preOP, assistantSurgeon: e.target.value })}
                                                        placeholder="Yardımcı cerrah"
                                                        disabled={!editable}
                                                    />
                                                </div>
                                            </div>

                                            <div className="row mb-3">
                                                <div className="col-lg-3">
                                                    <p><strong>Hastane:</strong></p>
                                                </div>
                                                <div className="col-lg-9">
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        name="hospital"
                                                        value={preOP.hospital}
                                                        onChange={e => setPreOP({ ...preOP, hospital: e.target.value })}
                                                        placeholder="Hastane"
                                                        disabled={!editable}
                                                    />
                                                </div>
                                            </div>

                                            <div className="row mb-3">
                                                <div className="col-lg-3">
                                                    <p><strong>Hemşire:</strong></p>
                                                </div>
                                                <div className="col-lg-9">
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        name="nurse"
                                                        value={preOP.nurse}
                                                        onChange={e => setPreOP({ ...preOP, nurse: e.target.value })}
                                                        placeholder="Hemşire"
                                                        disabled={!editable}
                                                    />
                                                </div>
                                            </div>

                                            <div className="row mb-3">
                                                <div className="col-lg-3">
                                                    <p><strong>Anestezist:</strong></p>
                                                </div>
                                                <div className="col-lg-9">
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        name="anesthesiologist"
                                                        value={preOP.anesthesiologist}
                                                        onChange={e => setPreOP({ ...preOP, anesthesiologist: e.target.value })}
                                                        placeholder="Anestezist"
                                                        disabled={!editable}
                                                    />
                                                </div>
                                            </div>

                                            <div className="row mb-3">
                                                <div className="col-lg-3">
                                                    <p><strong>Anestezi Hemşiresi:</strong></p>
                                                </div>
                                                <div className="col-lg-9">
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        name="anesthesiaNurse"
                                                        value={preOP.anesthesiaNurse}
                                                        onChange={e => setPreOP({ ...preOP, anesthesiaNurse: e.target.value })}
                                                        placeholder="Anestezi hemşiresi"
                                                        disabled={!editable}
                                                    />
                                                </div>
                                            </div>

                                            {/* Save Changes Button */}
                                            {editable && <button className="btn btn-success" onClick={handleSaveChanges}>Değişiklikleri Kaydet</button>}
                                        </div>


                                        <div className="tab-pane fade pt-3" id="operation-process">
                                            <div className="row mb-3">
                                                <div className="col-lg-11">
                                                    <h5 className="card-title">Operasyon Süreci</h5>
                                                </div>
                                            </div>
                                            {/* Kullanılan özellikli malzemeler */}
                                            <div className="row mb-3">
                                                <div className="col-lg-12">
                                                    <h6 className="label">Kullanılan Özellikli Malzemeler</h6>
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        placeholder="Malzemeleri giriniz..."
                                                        name="materials"
                                                        value={OpProcessData.materials}
                                                        onChange={handleOPProcessChange}
                                                    />
                                                </div>
                                            </div>
                                            {/* Intraop kaçak testi yapıldı mı */}
                                            <div className="row mb-3">
                                                <div className="col-lg-12">
                                                    <div className="form-check">
                                                        <input
                                                            className="form-check-input"
                                                            type="checkbox"
                                                            //id="intraop-test" 
                                                            name="isIntraop"
                                                            checked={OpProcessData.isIntraop}
                                                            onChange={handleOPProcessChange}
                                                        />
                                                        <label className="form-check-label" htmlFor="intraop-test">
                                                            Intraop kaçak testi yapıldı mı?
                                                        </label>
                                                    </div>
                                                </div>
                                            </div>
                                            {/* Diren konuldumu */}
                                            <div className="row mb-3">
                                                <div className="col-lg-12">
                                                    <div className="form-check">
                                                        <input
                                                            className="form-check-input"
                                                            type="checkbox"
                                                            id="diren"
                                                            name="isDiren"
                                                            checked={OpProcessData.isDiren}
                                                            onChange={handleOPProcessChange}
                                                        />
                                                        <label className="form-check-label" htmlFor="diren">
                                                            Diren konuldumu?
                                                        </label>
                                                    </div>
                                                </div>
                                            </div>
                                            {isModified && (
                                                <div className="row mb-3">
                                                    <div className="col-lg-12 text-end">
                                                        <button className="btn btn-success" onClick={saveOPProcess}>
                                                            Değişiklikleri Kaydet
                                                        </button>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                        <div className="tab-pane fade pt-3" id="post-operation">
                                            <div className="row mb-3">
                                                <div className="col-lg-11">
                                                    <h5 className="card-title">POST OP Takip Süreci</h5>
                                                </div>
                                                <div className="col-lg-1">
                                                    <div className="btn-group text-end">
                                                        <button className="btn btn-primary btn-sm edit-btn" title="Edit" onClick={handleToggleEdit}><i className="ri ri-edit-2-fill" /></button>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="row mb-3">
                                                <div className="col-lg-12">
                                                    <h6 className="card-title">Takip Yaptığı Günler</h6>
                                                    <div className="row text-center">
                                                        <div className="col-lg-2">
                                                            <label>Takip Tarihi</label>
                                                        </div>
                                                        <div className="col-lg-2">
                                                            <label>Nabız</label>
                                                        </div>
                                                        <div class="col-lg-2">
                                                            <label>Ateş</label>
                                                        </div>
                                                        <div className="col-lg-2">
                                                            <label>Kan Basıncı</label>
                                                        </div>
                                                        <div className="col-lg-2">
                                                            <label>Oksijen Saturasyonu</label>
                                                        </div>
                                                        <div className="col-lg-2">
                                                            <label>Solunum Sayısı</label>
                                                        </div>
                                                    </div>
                                                    {followUpDays.map((day, index) => (
                                                        <div className="row" key={index}>
                                                            <div className="col-lg-2">
                                                                <input
                                                                    type="text"
                                                                    className="form-control"
                                                                    value={day.followUpDate}
                                                                    disabled={!editable}
                                                                    onChange={(e) => handleFollowUpChange(index, 'followUpDate', e.target.value)}
                                                                />
                                                            </div>
                                                            <div className="col-lg-2">
                                                                <input
                                                                    type="number"
                                                                    className="form-control"
                                                                    placeholder="Nabız"
                                                                    value={day.pulse}
                                                                    disabled={!editable}
                                                                    onChange={(e) => handleFollowUpChange(index, 'pulse', e.target.value)}
                                                                />
                                                            </div>
                                                            <div className="col-lg-2">
                                                                <input
                                                                    type="number"
                                                                    className="form-control"
                                                                    placeholder="Ateş"
                                                                    value={day.temperature}
                                                                    disabled={!editable}
                                                                    onChange={(e) => handleFollowUpChange(index, 'temperature', e.target.value)}
                                                                />
                                                            </div>
                                                            <div className="col-lg-2">
                                                                <input
                                                                    type="number"
                                                                    className="form-control"
                                                                    placeholder="Kan Basıncı"
                                                                    value={day.bloodPressure}
                                                                    disabled={!editable}
                                                                    onChange={(e) => handleFollowUpChange(index, 'bloodPressure', e.target.value)}
                                                                />
                                                            </div>
                                                            <div className="col-lg-2">
                                                                <input
                                                                    type="number"
                                                                    className="form-control"
                                                                    placeholder="Oksijen Saturasyonu"
                                                                    value={day.oxygenSaturation}
                                                                    disabled={!editable}
                                                                    onChange={(e) => handleFollowUpChange(index, 'oxygenSaturation', e.target.value)}
                                                                />
                                                            </div>
                                                            <div className="col-lg-2">
                                                                <input
                                                                    type="number"
                                                                    className="form-control"
                                                                    placeholder="Solunum Sayısı"
                                                                    value={day.respiratoryRate}
                                                                    disabled={!editable}
                                                                    onChange={(e) => handleFollowUpChange(index, 'respiratoryRate', e.target.value)}
                                                                />
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                            {isAdding && (
                                                <div className="row mb-3">
                                                    <div className="col-lg-2">
                                                        <input
                                                            type="date"
                                                            className="form-control"
                                                            value={newFollowUp.followUpDate}
                                                            onChange={(e) => handleFollowUpNewChange('followUpDate', e.target.value)}
                                                        />
                                                    </div>
                                                    <div className="col-lg-2">
                                                        <input
                                                            type="number"
                                                            className="form-control"
                                                            placeholder="Nabız"
                                                            value={newFollowUp.pulse}
                                                            onChange={(e) => handleFollowUpNewChange('pulse', e.target.value)}
                                                        />
                                                    </div>
                                                    <div className="col-lg-2">
                                                        <input
                                                            type="number"
                                                            className="form-control"
                                                            placeholder="Ateş"
                                                            value={newFollowUp.temperature}
                                                            onChange={(e) => handleFollowUpNewChange('temperature', e.target.value)}
                                                        />
                                                    </div>
                                                    <div className="col-lg-2">
                                                        <input
                                                            type="number"
                                                            className="form-control"
                                                            placeholder="Kan Basıncı"
                                                            value={newFollowUp.bloodPressure}
                                                            onChange={(e) => handleFollowUpNewChange('bloodPressure', e.target.value)}
                                                        />
                                                    </div>
                                                    <div className="col-lg-2">
                                                        <input
                                                            type="number"
                                                            className="form-control"
                                                            placeholder="Oksijen Saturasyonu"
                                                            value={newFollowUp.oxygenSaturation}
                                                            onChange={(e) => handleFollowUpNewChange('oxygenSaturation', e.target.value)}
                                                        />
                                                    </div>
                                                    <div className="col-lg-2">
                                                        <input
                                                            type="number"
                                                            className="form-control"
                                                            placeholder="Solunum Sayısı"
                                                            value={newFollowUp.respiratoryRate}
                                                            onChange={(e) => handleFollowUpNewChange('respiratoryRate', e.target.value)}
                                                        />
                                                    </div>
                                                </div>
                                            )}
                                            <div className="row">
                                                <div className="col-lg-12 text-end">
                                                    {isAdding && (
                                                        <button className="btn btn-primary me-2" onClick={handleFollowUpSave}>
                                                            Kaydet
                                                        </button>
                                                    )}
                                                    {isEditedFollowUp && (
                                                        <button className="btn btn-primary me-2" onClick={handleFollowUpSave}>
                                                            Kaydet
                                                        </button>
                                                    )}
                                                    {!isAdding && (
                                                        <button className="btn btn-secondary" onClick={() => setIsAdding(true)}>
                                                            Ekle
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                            {/* Postop kaçak testi yapıldımı */}
                                            <div className="row mb-3">
                                                <div className="col-lg-12">
                                                    <div className="form-check">
                                                        <input
                                                            className="form-check-input"
                                                            type="checkbox"
                                                            id="postOpLeakTest"
                                                            checked={postOp.postOpLeakTest}
                                                            onChange={handlePostOpChange}
                                                            disabled={!editable}
                                                        />
                                                        <label className="form-check-label" htmlFor="postOpLeakTest">
                                                            Postop kaçak testi yapıldı mı?
                                                        </label>
                                                    </div>
                                                </div>
                                            </div>
                                            {/* Diren kaçıncı gün çekildi */}
                                            <div className="row mb-3">
                                                <div className="col-lg-12">
                                                    <h6 className="label">Diren Kaçıncı Gün Çekildi</h6>
                                                    <input
                                                        type="number"
                                                        className="form-control"
                                                        id="drainRemovalDay"
                                                        placeholder="Kaçıncı gün çekildi"
                                                        value={postOp.drainRemovalDay}
                                                        onChange={handlePostOpChange}
                                                        disabled={!editable}
                                                    />
                                                </div>
                                            </div>
                                            {/* Diyetisyen görüşmesi yapıldı mı */}
                                            <div className="row mb-3">
                                                <div className="col-lg-12">
                                                    <h6 className="label">Diyetisyen Görüşmesi Yapıldı mı?</h6>
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        id="dietitianConsultation"
                                                        placeholder="Evet ise diyetisyen ismi..."
                                                        value={postOp.dietitianConsultation}
                                                        onChange={handlePostOpChange}
                                                        disabled={!editable}
                                                    />
                                                </div>
                                            </div>
                                            {/* Taburculukta önerilen ilaçlar */}
                                            <div className="row mb-3">
                                                <div className="col-lg-12">
                                                    <h6 className="label">Taburculukta Önerilen İlaçlar</h6>
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        id="dischargeMedications"
                                                        placeholder="Önerilen ilaçlar..."
                                                        value={postOp.dischargeMedications}
                                                        onChange={handlePostOpChange}
                                                        disabled={!editable}
                                                    />
                                                </div>
                                            </div>
                                            {/* Taburculukta önerilen supplementlerin listesi */}
                                            <div className="row mb-3">
                                                <div className="col-lg-12">
                                                    <h6 className="label">Taburculukta Önerilen Supplementlerin Listesi</h6>
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        id="dischargeSupplements"
                                                        placeholder="Önerilen supplementler..."
                                                        value={postOp.dischargeSupplements}
                                                        onChange={handlePostOpChange}
                                                        disabled={!editable}
                                                    />
                                                </div>
                                            </div>
                                            <div className="row">
                                                <div className="col-lg-12 text-end">
                                                    {isEdited && (
                                                        <button className="btn btn-primary me-2" onClick={handlePostOpSave}>
                                                            Kaydet
                                                        </button>
                                                    )}

                                                </div>
                                            </div>
                                            {/* Taburculukta önerilen supplementlerin listesi */}

                                        </div>
                                        <div className="tab-pane fade profile-overview pt-3" id="monitoring">
                                            <div className="row mb-3">
                                                <div className="col-lg-11">
                                                    <h5 className="card-title">İzleme Kısmı</h5>
                                                </div>
                                                <div className="col-lg-1">
                                                    <div className="btn-group text-end">
                                                        <button className="btn btn-primary btn-sm edit-btn" title="Edit" onClick={(handleEditMonitor)}><i className="ri ri-edit-2-fill" /></button>
                                                    </div>
                                                </div>
                                            </div>
                                            {/* Hasta Progress notu ekle butonu */}
                                            {/* <div class="row mb-3">
                                          <div class="col-lg-12">
                                              <button class="btn btn-success">Hasta Progress Notu Ekle</button>
                                          </div>
                                            </div> */}
                                            {/* Hasta Progress Notu ve Gözlem Planı */}
                                            <div className="row mb-3">
                                                <div className="col-lg-6">
                                                    <h6 className="label">Hastanın Durumu</h6>
                                                    <textarea className="form-control" name="patientState" rows={5} placeholder="Hastanın durumu... " defaultValue={monitoring.patientState} disabled={!editableMonitor}
                                                        onChange={handleMonitoringChange} />
                                                </div>
                                                <div className="col-lg-6">
                                                    <h6 className="label">Hastanın Gözlem Planı</h6>
                                                    <textarea className="form-control" name="patientMonitoring" rows={5} placeholder="Hastanın gözlem planı..." defaultValue={monitoring.patientMonitoring} disabled={!editableMonitor}
                                                        onChange={handleMonitoringChange} />
                                                </div>
                                            </div>
                                            {isChangeMonitoring && (
                                                <div className="row mb-3">
                                                    <div className="col-lg-12 text-end">
                                                        <button className="btn btn-success" onClick={saveMonitoring}>
                                                            Değişiklikleri Kaydet
                                                        </button>
                                                    </div>
                                                </div>
                                            )}
                                            {/* Periodik gözlemler bölümü */}
                                            <div className="row mb-3">
                                                <div className="col-lg-12">
                                                    <h6 className="label">Periodik Gözlemler</h6>
                                                    {/* Tab buttons */}
                                                    <ul className="nav nav-tabs" id="periodic-tab" role="tablist">
                                                        <li className="nav-item" role="presentation">
                                                            <button className="nav-link active" id="month1-tab" data-bs-toggle="tab" data-bs-target="#month1" type="button" role="tab" aria-controls="month1" aria-selected="true">1. Ay</button>
                                                        </li>
                                                        <li className="nav-item" role="presentation">
                                                            <button className="nav-link" id="month3-tab" data-bs-toggle="tab" data-bs-target="#month3" type="button" role="tab" aria-controls="month3" aria-selected="false">3. Ay</button>
                                                        </li>
                                                        <li className="nav-item" role="presentation">
                                                            <button className="nav-link" id="month6-tab" data-bs-toggle="tab" data-bs-target="#month6" type="button" role="tab" aria-controls="month6" aria-selected="false">6. Ay</button>
                                                        </li>
                                                        <li className="nav-item" role="presentation">
                                                            <button className="nav-link" id="month12-tab" data-bs-toggle="tab" data-bs-target="#month12" type="button" role="tab" aria-controls="month12" aria-selected="false">12. Ay</button>
                                                        </li>
                                                    </ul>
                                                    {/* Tab content */}
                                                    <div className="tab-content mt-3" id="periodic-tabContent">
                                                        {/* 1. Ay Gözlemleri */}
                                                        <div className="tab-pane fade show active" id="month1" role="tabpanel" aria-labelledby="month1-tab">
                                                            <h6 className="label">1. Ay Gözlemleri</h6>
                                                            <ul>
                                                                <li>VKI: <input type="text" className="form-control" placeholder="VKI" name="vki-1" value={periodicMonitoring.month1.vki || ''} onChange={handlePeriodicMonitoringChange} /></li>
                                                                <li>EWL (%): <input type="text" className="form-control" placeholder="EWL" name="ewl-1" value={periodicMonitoring.month1.ewl || ''} onChange={handlePeriodicMonitoringChange} /></li>
                                                                <li>Kan Değerleri: {renderFileLink('1-month', 'bloodValues')}</li>
                                                                <li>Görüntüleme Dosyası: {renderFileLink('1-month', 'imagingFile')}</li>
                                                            </ul>
                                                            <h6 className="label">Hasta Fotoğrafı</h6>
                                                            {renderFileLink('1-month', 'photo')}
                                                        </div>

                                                        {/* 3. Ay Gözlemleri */}
                                                        <div className="tab-pane fade" id="month3" role="tabpanel" aria-labelledby="month3-tab">
                                                            <h6 className="label">3. Ay Gözlemleri</h6>
                                                            <ul>
                                                                <li>VKI: <input type="text" className="form-control" placeholder="VKI" name="vki-3" value={periodicMonitoring.month3.vki || ''} onChange={handlePeriodicMonitoringChange} /></li>
                                                                <li>EWL (%): <input type="text" className="form-control" placeholder="EWL" name="ewl-3" value={periodicMonitoring.month3.ewl || ''} onChange={handlePeriodicMonitoringChange} /></li>
                                                                <li>Kan Değerleri: {renderFileLink('3-month', 'bloodValues')}</li>
                                                                <li>Görüntüleme Dosyası: {renderFileLink('3-month', 'imagingFile')}</li>
                                                            </ul>
                                                            <h6 className="label">Hasta Fotoğrafı</h6>
                                                            {renderFileLink('3-month', 'photo')}
                                                        </div>

                                                        {/* 6. Ay Gözlemleri */}
                                                        <div className="tab-pane fade" id="month6" role="tabpanel" aria-labelledby="month6-tab">
                                                            <h6 className="label">6. Ay Gözlemleri</h6>
                                                            <ul>
                                                                <li>VKI: <input type="text" className="form-control" placeholder="VKI" name="vki-6" value={periodicMonitoring.month6.vki || ''} onChange={handlePeriodicMonitoringChange} /></li>
                                                                <li>EWL (%): <input type="text" className="form-control" placeholder="EWL" name="ewl-6" value={periodicMonitoring.month6.ewl || ''} onChange={handlePeriodicMonitoringChange} /></li>
                                                                <li>Kan Değerleri: {renderFileLink('6-month', 'bloodValues')}</li>
                                                                <li>Görüntüleme Dosyası: {renderFileLink('6-month', 'imagingFile')}</li>
                                                            </ul>
                                                            <h6 className="label">Hasta Fotoğrafı</h6>
                                                            {renderFileLink('6-month', 'photo')}
                                                        </div>

                                                        {/* 12. Ay Gözlemleri */}
                                                        <div className="tab-pane fade" id="month12" role="tabpanel" aria-labelledby="month12-tab">
                                                            <h6 className="label">12. Ay Gözlemleri</h6>
                                                            <ul>
                                                                <li>VKI: <input type="text" className="form-control" placeholder="VKI" name="vki-12" value={periodicMonitoring.month12.vki || ''} onChange={handlePeriodicMonitoringChange} /></li>
                                                                <li>EWL (%): <input type="text" className="form-control" placeholder="EWL" name="ewl-12" value={periodicMonitoring.month12.ewl || ''} onChange={handlePeriodicMonitoringChange} /></li>
                                                                <li>Kan Değerleri: {renderFileLink('12-month', 'bloodValues')}</li>
                                                                <li>Görüntüleme Dosyası: {renderFileLink('12-month', 'imagingFile')}</li>
                                                            </ul>
                                                            <h6 className="label">Hasta Fotoğrafı</h6>
                                                            {renderFileLink('12-month', 'photo')}
                                                        </div>

                                                        <div className="col-lg-12 text-end">
                                                            {isChanged && (
                                                                <button className="btn btn-success" onClick={savePeriodicMonitoring}>
                                                                    Değişiklikleri Kaydet
                                                                </button>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>{/* End Bordered Tabs */}
                                    </div>



                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </main>{/* End #main */}
            {/* ======= Footer ======= */}
            <footer id="footer" className="footer">
                <div className="copyright">
                    © Copyright <strong><span>Patient Management</span></strong>. All Rights Reserved
                </div>
                <div className="credits">
                    {/* All the links in the footer should remain intact. */}
                    {/* You can delete the links only if you purchased the pro version. */}
                    {/* Licensing information: https://bootstrapmade.com/license/ */}
                    {/* Purchase the pro version with working PHP/AJAX contact form: https://bootstrapmade.com/nice-admin-bootstrap-admin-html-template/ */}
                    Designed by <a>Zekican and Ozan</a>
                </div>
            </footer>{/* End Footer */}
            <a href="#" className="back-to-top d-flex align-items-center justify-content-center"><i className="bi bi-arrow-up-short" /></a>
            {/* Vendor JS Files */}
            {/* Template Main JS File */}
        </div>

    );
};

export default PatientDetails;


