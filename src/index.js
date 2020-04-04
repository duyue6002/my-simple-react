import React from "./react";
import ReactDOM from "./react-dom";
import Component from "./react/component";

class Counter extends Component {
  constructor(props) {
    super(props);
    this.state = {
      num: 0
    };
    this.onClick = this.onClick.bind(this);
  }

  componentDidUpdate() {
    console.log("update");
  }

  componentDidMount() {
    console.log("mount");
    for (let i = 0; i < 100; i++) {
      // this.setState({ num: this.state.num + 1 });
      // console.log(this.state.num);
      this.setState(prevState => {
        console.log(prevState.num);
        return { num: prevState.num + 1 };
      });
    }
  }

  onClick() {
    this.setState({ num: this.state.num + 1 });
  }

  render() {
    return (
      <div onClick={this.onClick}>
        <h1>number: {this.state.num}</h1>
        <button>add</button>
      </div>
    );
  }
}

ReactDOM.render(<Counter />, document.getElementById("root"));
