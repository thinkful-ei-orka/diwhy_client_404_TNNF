import React from 'react';
import './HelpWantedItem.css';
import AppContext from '../../contexts/AppContext';
import WantApiService from '../../Services/want-api-service';
import PostApplicantForm from '../CreateNew/PostApplicantForm';
import PostingsApiService from '../../Services/postings-api-service';
import ApplicantItem from './ApplicantItem';

class HelpWantedItem extends React.Component {
    static contextType = AppContext;

    static defaultProps = {
        history: {
            push: () => { },
        },
    };

    state = {
        posting: {},
        applicants: []
    }


    componentDidMount() {
        WantApiService.getById(this.props.id)
            .then(posting => {
                this.setState({
                    posting: posting
                })
            })

        PostingsApiService.getApplicationsByPosting(this.props.id)
            .then(applicants => {
                this.context.setApplicants(applicants)
            })
    }

    getCategoryName(id) {
        const categoryById = this.context.categories.find(category => category.id === id)
        if (categoryById) {
            return categoryById.name
        }
    }



    handleDeletePosting = (posting_id) => {
        PostingsApiService.deletePosting(posting_id)
            .then(() => {
                PostingsApiService.getApplicationsByPosting(this.props.id)
                    .then(applicants => {
                        this.context.setApplicants(applicants)
                    })
                
            })
    }

    render() {
        const applicantsList = this.context.applicants.map(applicant => {
            return (
                <ApplicantItem key={applicant.id} applicant={applicant} posting={this.state.posting} />
            )
        })
        return (
            <div >
                <div className="hw-internal-container">
                    <div className="hw-header-content">
                        <a href={`/profile/${this.state.posting.user_name}`}><h2 className="hw-name"> {this.state.posting.user_name}</h2></a>
                        <h3 className="hw-title"><i>{this.state.posting.title}</i></h3>
                    </div>
                    <p className='hw-content'>{this.state.posting.content}</p>
                    <p>Topic: {this.getCategoryName(this.state.posting.category)}</p>
                    <div className="hw-body-buttons">
                        {(this.context.user.user_name === this.state.posting.user_name) && 
                        <button type='button' className="hw-btn" onClick={() => this.handleDeletePosting(this.state.posting.id)}>Delete</button>}
                    </div>
                    {!(this.state.posting.user_name === this.context.user.user_name) && <PostApplicantForm id={this.state.posting.id} />}
                </div>
                <ul className='applicants-list' >
                    {applicantsList}
                </ul>
            </div>
        );
    }
}

export default HelpWantedItem;