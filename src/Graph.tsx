import React, { Component } from 'react';
import { Table } from '@finos/perspective';
import { ServerRespond } from './DataStreamer';
import './Graph.css';

// ...

interface IProps {
  data: ServerRespond[];
}

/**
 * Perspective library adds load to HTMLElement prototype.
 * This interface acts as a wrapper for the TypeScript compiler.
 */
interface PerspectiveViewerElement extends HTMLElement {
  load: (table: Table) => void;
}

/**
 * React component that renders Perspective based on data
 * parsed from its parent through the data property.
 */
class Graph extends Component<IProps, {}> {
  // Perspective table
  table: Table | undefined;

  componentDidMount() {
    // Get the element to attach the table from the DOM.
    const elem = document.getElementsByTagName('perspective-viewer')[0] as unknown as PerspectiveViewerElement;

    const schema = {
      stock: 'string',
      top_ask_price: 'float',
      top_bid_price: 'float',
      timestamp: 'string', // Change to 'string' for ISO timestamps
    };

    if (window.perspective && window.perspective.worker()) {
      this.table = window.perspective.worker().table(schema);
    }

    if (this.table) {
      // Load the `table` in the `<perspective-viewer>` DOM reference.
      elem.load(this.table);
      elem.setAttribute('view', 'y_line');
      elem.setAttribute('column-pivots', '["stock"]');
      elem.setAttribute('row-pivots', '["timestamp"]');
      elem.setAttribute('columns', '["top_ask_price"]');
      elem.setAttribute('aggregates', JSON.stringify({
        "stock": "distinct count",
        "top_ask_price": "avg",
        "top_bid_price": "avg",
        "timestamp": "distinct count",
      }));
    }
  }

  componentDidUpdate(prevProps: IProps) {
    // Every time the data prop is updated, insert the data into the Perspective table
    if (this.table && this.props.data !== prevProps.data) {
      // Format the data and update the table with the new data
      this.table.update(this.props.data.map((el: any) => ({
        stock: el.stock,
        top_ask_price: el.top_ask ? el.top_ask.price : 0,
        top_bid_price: el.top_bid ? el.top_bid.price : 0,
        timestamp: el.timestamp,
      })));
    }
  }

  render() {
    return (
      // Here, you should add the content you want to render in your Graph component.
      // You can add charts or any other necessary elements.
      <div className="graph-container">
        {/* Add your content here */}
      </div>
    );
  }
}

export default Graph;
