import React from "react";
import { Row, Card } from "antd";
import ListRecipient from "./ListRecipient";

const App = () => (
  <Row type="flex" justify="center" align="middle">
    <Card
      title="Recipient Manage"
      headStyle={{ background: "#20B2AA", textAlign: "center" }}
    >
      <ListRecipient isSelect={false} />
    </Card>
  </Row>
);
export default App;
