import React, { Component } from 'react'
// import { Link } from 'react-router-dom'
import AppContext from '../../contexts/AppContext'
import { Label } from '../Util/Util'
import ThreadsApiService from '../../Services/threads-api-service';
import './Feed.css'

export default class Feed extends Component {
    constructor(props) {
        super(props);
        this.state = {
            value: '',
            threads: []
        };

        this.handleChange = this.handleChange.bind(this);
    }

    static contextType = AppContext

    componentDidMount() {
        this.context.clearError()
        const threads = ThreadsApiService.getThreads()
        this.setState({ threads })
    }

    handleChange(e) {
        this.setState({
            value: e.target.value,
        })
    }

//handleFilterChange
//receive value from state
//filter feed posts by value in render?
//    {postings.filter(posting => posting.category_id === value)).map(filteredPosting => (
//     <li>
//       {filteredPosting}
//     </li>
//    ))}

    render() {
        const { threads } = this.state;
        console.log(threads)

        const threadsList = threads.map(thread => {
            return <div className="tl-header" key={thread.id}>
                <div className="tl-pic-container">
                    <img src="https://via.placeholder.com/100" alt='prop' className="tl-pic"></img>
                </div>
                <div className="tl-header-content">
                    <div className="tl-name-container">
                        <h2 className="hw-name">{this.context.user.user_name}</h2>
                    </div>
                    <div className="tl-title-container">
                        <h3 className="tl-title"><i>{thread.title}</i></h3>
                    </div>
                    <div className='tl-options'>
                        <div>Like</div>
                        <div>Unanswered</div>
                        <div>Add To Watch List</div>
                    </div>
                </div>

            </div>
        })

        return (
            <section className='dash-item'>
                <h3 id='header'>Feed</h3>
                <Label htmlFor='Feed_Category_Select'>Filter By Category</Label>
                <select className='Feed_Category_Select' value={this.state.value} onChange={this.handleChange}>
                    <option value='1'>Woodworking</option>
                    <option value='2'>Metalworking</option>
                    <option value='3'>Needlecraft</option>
                    <option value='4'>Automotive</option>
                    <option value='5'>Home Improvement</option>
                    <option value='6'>General Crafts</option>
                    <option value='7'>Electronics</option>
                    <option value='8'>Outdoorsmanship</option>
                </select>
                <div className='tl-main-container'>
                    <div className="tl-item-container">
                        <div className="tl-header">
                            <div className="tl-pic-container">
                                <img src="https://via.placeholder.com/100" alt='prop' className="tl-pic"></img>
                            </div>
                            <div className="tl-header-content">
                                <div className="tl-name-container">
                                    <h2 className="hw-name">user 1</h2>
                                </div>
                                <div className="tl-title-container">
                                    <h3 className="tl-title"><i>title</i></h3>
                                </div>
                            </div>
                        </div>
                        <div className='tl-options'>
                            <div>Like</div>
                            <div>Unanswered</div>
                            <div>Add To Watch List</div>
                        </div>
                        {threadsList}
                    </div>
                </div>
            </section>
        )
    }
}