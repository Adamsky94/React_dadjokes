import axios from "axios";
import "./JokeList.css";
import Joke from "./Joke";
import uuid from "uuid/dist/v4";
import React, { Component } from "react";

class JokeList extends Component {
    static defaultProps = {
        numJokesToGet: 10,
    };
    constructor(props) {
        super(props);
        this.state = { 
            jokes: JSON.parse(window.localStorage.getItem("jokes") || "[]"),
            loading: false
    };
        this.seenJokes = new Set(this.state.jokes.map(j => j.text));
        this.handleClick = this.handleClick.bind(this);
    }
    componentDidMount() {
        //Load Jokes
        if(this.state.jokes.length === 0) this.getJokes();

    }
    async getJokes() {
        try {
        let jokes = [];
        while (jokes.length < this.props.numJokesToGet) {
            let res = await axios.get("https://icanhazdadjoke.com/", {
                headers: { Accept: "application/JSON" },
            });
            let newJoke = res.data.joke;
            if (!this.seenJokes.has(newJoke)) {
            jokes.push({ id: uuid(), text: res.data.joke, votes: 0 });
            } else {

            } 
        }
        this.setState(st => ({
            loading: false,
            jokes: [...st.jokes, ...jokes]
        }),
        () => window.localStorage.setItem("jokes", JSON.stringify(this.state.jokes))
        );
    } catch(e){
        alert(e);
        this.setState({loading: false})
    }
    }
    handleVote(id, delta) {
        this.setState((st) => ({
            jokes: st.jokes.map((j) =>
                j.id === id ? { ...j, votes: j.votes + delta } : j
            ),
        }),
        () => window.localStorage.setItem("jokes", JSON.stringify(this.state.jokes))
        );
    }
    handleClick(){
        this.setState({loading: true}, this.getJokes);
    }
    render() {
        if(this.state.loading){
            return(
            <div className="JokeList-spinner">
                <i className="far fa-8x fa-laugh fa-spin"/>
                <h1 className="JokeList-title">Loading...</h1>
            </div>
            )
        }
        return (
            <div className="JokeList">
                <div className="JokeList-sidebar">
                    <h1 className="JokeList-title">
                        <span>Dad</span> Jokes
                    </h1>
                    <img src="https://www.creativefabrica.com/wp-content/uploads/2019/03/Dad-joke-loading.jpg" />
                    <button className="JokeList-getmore" onClick={this.handleClick}>New Jokes</button>
                </div>
                <div className="JokeList-jokes">
                    {this.state.jokes.map((j) => (
                        <Joke
                            votes={j.votes}
                            text={j.text}
                            upvote={() => this.handleVote(j.id, 1)}
                            downvote={() => this.handleVote(j.id, -1)}
                        />
                    ))}
                </div>
            </div>
        );
    }
}

export default JokeList;
