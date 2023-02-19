import { Space, Table, DatePicker, Select } from "antd";
import { useEffect, useState } from "react";
import { instance } from "../../utils.js";
import "../../Assets/CSS/EmployeeManage.css";
import dayjs from "dayjs";
import moment from "moment";
import _ from "lodash";

const { RangePicker, MonthPicker } = DatePicker;

function DashBoard() {
  const filterDefault = { label: "All", value: "" };

  const [dataSource, setDataSource] = useState([]);
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth() + 1);
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [total, setTotal] = useState(0);
  const [filterSelect, setfilterSelect] = useState([{ ...filterDefault }]);
  const [filter, setFilter] = useState("");

  useEffect(() => {
    loadDatas();
  }, [currentMonth, currentYear]);

  const loadDatas = async function (e) {
    const res = await instance.get(
      `admin/GetListTransaction?month=${currentMonth}&year=${currentYear}`
    );
    if (res.data.success === true) {
      const result = res.data.data.map((row) => ({
        key: row.ID,
        stkSend: row.AccountPaymentSend,
        stkReceive: row.AccountPaymentReceive,
        money: row.Amount,
        content: row.Content,
        paymentFeeType: row.PaymentName,
        bankReference: row.BankName,
        transDate: row.TransactionTime,
      }));

      setDataSource(result);

      setfilterSelect([
        { ...filterDefault },
        ..._.uniqWith(
          filterData(result)((i) => i.bankReference),
          _.isEqual
        ),
      ]);
      setFilter([]);
    }
  };

  useEffect(() => {
    setTotal(
      [...dataSource.filter((e) => e.bankReference.includes(filter))].reduce(
        (sum, b) => sum + parseInt(b.money),
        0
      )
    );
  }, [filter, dataSource]);

  const filterData = (data) => (formatter) =>
    data.map((item) => ({
      label: formatter(item),
      value: formatter(item),
    }));

  const columns = [
    {
      title: "Account send",
      dataIndex: "stkSend",
      key: "stkSend",
    },
    {
      title: "Account receive",
      dataIndex: "stkReceive",
      key: "stkReceive",
    },
    {
      title: "Money",
      dataIndex: "money",
      key: "money",
      filteredValue: [...filter] || [],
      onFilter: (value, record) => record.bankReference.includes(filter),
      render: (value) =>
        value.toLocaleString().replace(/\B(?=(\d{3})+(?!\d))/g, ","),
    },
    {
      title: "Content",
      dataIndex: "content",
      key: "content",
    },
    {
      title: "Payment Fee Type",
      dataIndex: "paymentFeeType",
      key: "paymentFeeType",
    },
    {
      title: "Bank Reference",
      dataIndex: "bankReference",
      key: "bankReference",
    },
    {
      title: "Transaction date",
      dataIndex: "transDate",
      key: "transDate",
      render: (value) => moment(value).format("HH:ss:mm DD-MM-YYYY"),
    },
  ];

  return (
    <>
      <Space style={{ marginBottom: 16 }}>
        <MonthPicker
          picker="month"
          format={"MM-YYYY"}
          allowClear={false}
          defaultValue={dayjs()}
          onChange={(date, dateString) => {
            const temp = dateString.split("-");
            setCurrentMonth(temp[0]);
            setCurrentYear(temp[1]);
          }}
        />
        <RangePicker
          format={"DD-MM-YYYY"}
          onChange={(dates, dateStrings) => {
            if (dateStrings[0] !== "" && dateStrings[1] !== "") {
              const filteredData = dataSource.filter((entry) => {
                const currentDate = moment(entry.transDate, "YYYY-MM-DD");
                const startDate = moment(dateStrings[0], "DD-MM-YYYY");
                const endDate = moment(dateStrings[1], "DD-MM-YYYY");

                return currentDate.isBetween(startDate.add(-1), endDate.add(1));
              });

              setDataSource(filteredData);
            } else {
              loadDatas();
            }
          }}
        />
        <Select
          style={{
            width: "200px",
          }}
          options={filterSelect}
          onChange={(e) => setFilter(e)}
          defaultValue={filterSelect[0]}
        />
        <h1>
          Total: {total.toLocaleString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
        </h1>
      </Space>
      <Table columns={columns} dataSource={dataSource} />
    </>
  );
}

export default DashBoard;
