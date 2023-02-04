import React from "react";
import { Row, Card } from "antd";
import ListRecipient from "./ListRecipient";

const App = () => (
  <Row type="flex" justify="center" align="middle">
    <Card title="Recipient Manage">
      <ListRecipient isSelect={false} />
    </Card>
  </Row>
);
export default App;
