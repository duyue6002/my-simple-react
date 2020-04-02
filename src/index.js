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

// function Welcome(props) {
//   return <h1>Hello, {props.name}</h1>;
// }

// function App() {
//   return (
//     <div>
//       <Welcome name="Leia" />
//       <Welcome name="Luke" />
//       <Welcome name="Solo" />
//     </div>
//   );
// }

// ReactDOM.render(<App />, document.getElementById("root"));
