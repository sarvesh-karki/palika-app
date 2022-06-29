import React, { useState } from 'react';
import { TabContent, TabPane, Nav, NavItem, NavLink, Card, Row, Col } from 'reactstrap';
import classnames from 'classnames';

import BeneficiaryList from './beneficiaryList';
import VendorList from './vendorList';
import MobilizersList from './mobilizersList';
import FspList from './fspList';

const Tabs = ({ projectId }) => {
	const [activeTab, setActiveTab] = useState('1');

	const toggle = tab => {
		if (activeTab !== tab) setActiveTab(tab);
	};

	return (
		<div>
			<Card>
				<div className="stat-card-body">
					<Nav tabs>
						<NavItem>
							<NavLink
								className={classnames({ active: activeTab === '1' })}
								onClick={() => {
									toggle('1');
								}}
							>
								Beneficiaries
							</NavLink>
						</NavItem>
						<NavItem>
							<NavLink
								className={classnames({ active: activeTab === '2' })}
								onClick={() => {
									toggle('2');
								}}
							>
								Vendors
							</NavLink>
						</NavItem>
						<NavItem>
							<NavLink
								className={classnames({ active: activeTab === '3' })}
								onClick={() => {
									toggle('3');
								}}
							>
								Mobilizers
							</NavLink>
						</NavItem>
						<NavItem>
							<NavLink
								className={classnames({ active: activeTab === '4' })}
								onClick={() => {
									toggle('4');
								}}
							>
								FSPs
							</NavLink>
						</NavItem>
					</Nav>
					<TabContent className="pt-4" activeTab={activeTab}>
						<TabPane tabId="1">
							<Row>
								<Col sm="12">
									<BeneficiaryList projectId={projectId} />
								</Col>
							</Row>
						</TabPane>
						<TabPane tabId="2">
							<Row>
								<Col sm="12">
									<VendorList projectId={projectId} />
								</Col>
							</Row>
						</TabPane>
						<TabPane tabId="3">
							<Row>
								<Col sm="12">
									<MobilizersList projectId={projectId} />
								</Col>
							</Row>
						</TabPane>
						<TabPane tabId="4">
							<Row>
								<Col sm="12">
									<FspList projectId={projectId} />
								</Col>
							</Row>
						</TabPane>
					</TabContent>
				</div>
			</Card>
		</div>
	);
};

export default Tabs;
