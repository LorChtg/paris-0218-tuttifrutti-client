import React from 'react'
import Modal from 'react-responsive-modal'
import axios from 'axios'
import { userInfo } from '../User.js'
import Button from '../components/Button.js'
import MissionTitle from '../components/MissionTitle.js'
import MissionId from '../components/MissionId.js'
import MissionStudent from '../components/MissionStudent.js'
import MissionDeadline from '../components/MissionDeadline.js'
import MissionPrice from '../components/MissionPrice.js'
import ReportProblem from '../components/ReportProblem.js'
import './style/OldMissions.css'

class OldMissions extends React.Component {
	state = {
		oldMissions: [],
		lawyer: {},
		open: false,
		clickedMission: ''
	}

	onOpenModal = (event) => {
		event.preventDefault()
		this.setState({ open: true})
	}

	addIdAndOpenModal = (mission,event) => {
			this.setState({clickedMission: mission})
			this.onOpenModal(event)
	}

	onCloseModal = () => {
		this.setState({ open: false })
	}

	componentDidMount() {
		userInfo()
			.then(res =>
				this.setState({
					lawyer: {
						id: res._id
					}
				}))
			.then(() => {
				const lawyerId = this.state.lawyer.id
				axios.post(`http://localhost:3030/oldmissionsfiltered`, { lawyerId })
					.then((res) => {
						this.setState({ oldMissions: res.data })
					})
					.catch((error) => {
						console.log(error);
					})
			}
			)
	}

	render() {

		const eachMission = mission => {
				return (
					<div key={mission._id} className='each-mission-container'>
						<div className='old-mission-block-title'>
							<MissionTitle text={mission.name} />
							<MissionId text={mission._id} />
						</div>
						<MissionDeadline text={mission.deadline} />
						<MissionPrice text={mission.price} />
						<MissionStudent text='La mission a été réalisée par Daniel.' />
						<div className='old-missions-button'>
							<Button>Télécharger la facture</Button>
							<div onClick={(event) => this.addIdAndOpenModal(mission._id, event)
							}><Button>Signaler un problème</Button></div>
						</div>
					</div>
				)
		}


		const showEachMission = this.state.oldMissions.map(mission => eachMission(mission))

		const { open } = this.state

		return (
			<div className='old-missions-container'>
				{showEachMission}
				<Modal open={open} onClose={this.onCloseModal} center>
					<ReportProblem close={this.onCloseModal} missionId={this.state.clickedMission}/>
				</Modal>
			</div>
		)
	}
}

export default OldMissions
