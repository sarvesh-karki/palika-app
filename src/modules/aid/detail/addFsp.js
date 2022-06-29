import React, { useState, useEffect, useContext } from 'react';
import { useToasts } from 'react-toast-notifications';
import { Card, CardBody, Row, Col, Form, FormGroup, Label, Input, Button } from 'reactstrap';

import { TOAST, APP_CONSTANTS, ROLES } from '../../../constants';
import { AidContext } from '../../../contexts/AidContext';
import { AppContext } from '../../../contexts/AppSettingsContext';
import { UserContext } from '../../../contexts/UserContext';
import { History } from '../../../utils/History';
import SelectWrapper from '../../global/SelectWrapper';
import GrowSpinner from '../../../modules/global/GrowSpinner';
import BreadCrumb from '../../ui_components/breadcrumb';

const AddFsp = () => {
    const { addToast } = useToasts();
    const { listFinancialInstitutions, addAid } = useContext(AidContext);
    const { loading, setLoading } = useContext(AppContext);
    const { listUsersByRole } = useContext(UserContext);

    const [benefUploadFile, setBenefUploadFile] = useState('');

    const [formData, setFormData] = useState({
        name: '',
        location: '',
        description: ''
    });
    const [selectedInstitutions, setSelectedInstitutions] = useState([]);
    const [selectedManager, setSelectedManager] = useState('');

    const handleInputChange = e => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleFileChange = e => {
        setBenefUploadFile(e.target.files[0]);
    };

    const handleInstitutionChange = data => {
        const institution_values = data.map(d => d.value);
        setSelectedInstitutions(institution_values);
    };

    const handleProjectManagerChange = e => {
        setSelectedManager(e.value);
    };

    const handleFormSubmit = e => {
        e.preventDefault();
        if (!selectedManager) return addToast('Please select project manager', TOAST.ERROR);
        const form_payload = createFormData(formData);
        setLoading(true);
        addAid(form_payload)
            .then(res => {
                setLoading(false);
                addToast(`Project created with ${res.uploaded_beneficiaries} beneficiary upload`, TOAST.SUCCESS);
                History.push('/projects');
            })
            .catch(err => {
                setLoading(false);
                let err_msg = err.message;
                if (err_msg === 'Request failed with status code 500') {
                    addToast('Project has been created', TOAST.SUCCESS);
                    err_msg = 'Upload failed due to duplicate data!';
                    addToast(err_msg, TOAST.ERROR);
                    History.push('/projects');
                } else addToast(err_msg, TOAST.ERROR);
            });
    };

    const createFormData = payload => {
        const form_data = new FormData();
        for (let property in payload) {
            form_data.append(property, payload[property]);
        }
        if (selectedInstitutions.length) form_data.append('financial_institutions', selectedInstitutions.toString());
        if (benefUploadFile) form_data.append('file', benefUploadFile);
        form_data.append('project_manager', selectedManager);
        return form_data;
    };

    const handleCancelClick = () => History.push('/projects');

    useEffect(() => {
        async function fetchData() {
            const users = await listUsersByRole(ROLES.MANAGER);
            const institutions = await listFinancialInstitutions({ limit: APP_CONSTANTS.FETCH_LIMIT });
            if (institutions && institutions.data.length) loadFinancialInstiturions(institutions.data);
            if (users && users.data.length) loadProjectManagers(users.data);
        }

        fetchData();
    }, [listUsersByRole, listFinancialInstitutions]);

    const loadFinancialInstiturions = data => {
        const populate_institutions = data.map(d => {
            return { label: d.name, value: d._id };
        });
    };

    const loadProjectManagers = users => {
        const populate_managers = users.map(u => {
            return { label: u.fullname, value: u.wallet_address };
        });
    };

    return (
        <div>
            <p className="page-heading">FSP</p>
            <BreadCrumb redirect_path="fsp" root_label="FSP" current_label="Add" />

            <Row>
                <Col md="12">
                    <Card>
                        <CardBody>
                            <Form onSubmit={handleFormSubmit} style={{ color: '#6B6C72' }}>
                                <Row>
                                    <Col>
                                    <FormGroup>
                                        <Label>Swift Code</Label>
                                        <Input type="text" name="swiftCode" required />
                                    </FormGroup>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col>
                                        <FormGroup>
                                            <Label>Name</Label>
                                            <Input type="text" required />
                                        </FormGroup>
                                    </Col>
                                    <Col>
                                        <FormGroup>
                                            <Label>Contact Name</Label>
                                            <Input type="text" required />
                                        </FormGroup>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col>
                                        <FormGroup>
                                            <Label>Contact Email</Label>
                                            <Input type="text" required />
                                        </FormGroup>
                                    </Col>
                                    <Col>
                                        <FormGroup>
                                            <Label>Contact Phone</Label>
                                            <Input type="text" required />
                                        </FormGroup>
                                    </Col>
                                </Row>
                                <CardBody style={{ paddingLeft: 0 }}>
                                    {loading ? (
                                        <GrowSpinner />
                                    ) : (
                                        <div>
                                            <Button type="submit" className="btn btn-info">
                                                <i className="fa fa-check"></i> Submit
                                            </Button>
                                            <Button
                                                type="button"
                                                onClick={handleCancelClick}
                                                style={{ borderRadius: 8 }}
                                                className="btn btn-dark ml-2"
                                            >
                                                Cancel
                                            </Button>
                                        </div>
                                    )}
                                </CardBody>
                            </Form>
                        </CardBody>
                    </Card>
                </Col>
            </Row>
        </div>
    );
};

export default AddFsp;

