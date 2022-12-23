import React, { Component } from "react";
import Cart from "./Cart";
import HTML5Backend from "react-dnd-html5-backend";
import { DragDropContext } from "react-dnd";
import ItemsDragLayer from "./ItemsDragLayer";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";

const styles = {
  main: {
    width: "50%",
    margin: "0 auto",
    textAlign: "center",
  },
  content: {
    display: "flex",
    flexFlow: "row",
    justifyContent: "left",
    alignItems: "stretch",
    alignContent: "stretch",
  },
};

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      leftItems: [
        "Item 1",
        "Item 2",
        "Item 3",
        "Item 4",
        "Item 5",
        "Item 6",
        "Item 7",
        "Item 8",
      ],
      rightItems: [],
    };

    this.addItemsToCart = this.addItemsToCart.bind(this);
    this.handlearrow = this.handlearrow.bind(this);
  }
  componentWillMount() {
    this.addItemsToCart = this.addItemsToCart.bind(this);

    const localdata =
      JSON.parse(localStorage.getItem("localitem")) || this.state;
    this.setState(localdata);
  }

  // handleinput = (e) => {
  //   console.log(e.target.value);
  // };

  addItemsToCart(items, source, dropResult) {
    const leftItems =
      source === "left"
        ? this.state.leftItems.filter(
            (x) => items.findIndex((y) => x === y) < 0
          )
        : this.state.leftItems.concat(items);
    const rightItems =
      source === "left"
        ? this.state.rightItems.concat(items)
        : this.state.rightItems.filter(
            (x) => items.findIndex((y) => x === y) < 0
          );
    this.setState({ leftItems, rightItems });
    localStorage.setItem("localitem", JSON.stringify(this.state));
  }

  // handle arrow click

  handlearrow(arrow) {
    const selecteditems = JSON.parse(localStorage.getItem("selecteditems"));
    const localitem =
      JSON.parse(localStorage.getItem("localitem")) || this.state;
    const rightitems = localitem ? localitem.rightItems : [];

    const tobedelited = new Set(selecteditems);
    const newRight = rightitems.filter((item) => {
      return !tobedelited.has(item);
    });
    console.log("newright", newRight);

    const leftitems = localitem ? localitem.leftItems : [];
    const newLeft = leftitems.filter((item) => {
      return !tobedelited.has(item);
    });
    console.log("newLeft", newLeft);

    if (arrow === "left") {
      localStorage.setItem(
        "localitem",
        JSON.stringify({
          leftItems: [...this.state.leftItems, ...selecteditems],
          rightItems: newRight,
        })
      );
      this.setState({
        leftItems: [...this.state.leftItems, ...selecteditems],
        rightItems: newRight,
      });
      localStorage.setItem("selecteditems", JSON.stringify([]));
    }
    if (arrow === "right") {
      localStorage.setItem(
        "localitem",
        JSON.stringify({
          leftItems: newLeft,
          rightItems: [...this.state.rightItems, ...selecteditems],
        })
      );
      this.setState({
        leftItems: newLeft,
        rightItems: [...this.state.rightItems, ...selecteditems],
      });
      localStorage.setItem("selecteditems", JSON.stringify([]));
    }
  }

  render() {
    return (
      <div style={styles.main}>
        <h2>Drag and drop multiple items</h2>
        <h4>Use Shift or Cmd key to multi-select</h4>

        <input
          type="text"
          placeholder="search here..."
          onChange={this.handleinput}
        />
        <br />
        <br />
        <br />

        <ItemsDragLayer />
        <div style={styles.content}>
          <Cart
            id="left"
            fields={this.state.leftItems}
            addItemsToCart={this.addItemsToCart}
          />

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              margin: "auto",
              gap: "20px",
              padding: "20px",
            }}
          >
            <div onClick={(e) => this.handlearrow("right")}>
              <FaArrowRight />
            </div>

            <div onClick={(e) => this.handlearrow("left")}>
              <FaArrowLeft />
            </div>
          </div>
          <Cart
            id="right"
            fields={this.state.rightItems}
            addItemsToCart={this.addItemsToCart}
            handlearrow={this.handlearrow}
          />
        </div>
      </div>
    );
  }
}

const dragDropContext = DragDropContext;
export default dragDropContext(HTML5Backend)(App);
