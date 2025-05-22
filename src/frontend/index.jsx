import React, { useEffect, useState } from "react";
import ForgeReconciler, {
  Box,
  Button,
  DynamicTable,
  Inline,
  Text,
  Textfield,
  xcss,
} from "@forge/react";
import { invoke } from "@forge/bridge";

const errorStyle = xcss({
  color: "color.text.danger",
});

const currency = "€";

const App = () => {
  const [error, setError] = useState(null);
  const [expensesArray, setExpensesArray] = useState(null);

  useEffect(() => {
    invoke("get-all").then(setExpensesArray);
  }, []);

  let expenseDescriptionValue = null;
  let expenseAmountValue = null;

  const add = (data) => {
    setExpensesArray([...expensesArray, data]);
  };

  const create = (data) => {
    invoke("create", {
      data: data,
      expenseDescription: expenseDescriptionValue,
      expenseAmount: expenseAmountValue,
    }).then(add);
    setError(null);
  };

  const remove = (data) => {
    setExpensesArray(expensesArray.filter((t) => t.id !== data.id));
  };

  const update = (data) => {
    if (data !== null) {
      setExpensesArray(
        expensesArray.map((t) => {
          if (t.id === data.id) {
            return data;
          } else {
            return t;
          }
        })
      );
    }
  };

  const validate = (data, item) => {
    if (
      (data.target.id === "expense-amount" ||
        data.target.id === "input-expense-amount") &&
      isNaN(Number(data.target.value))
    ) {
      setError("Warning: Amount must be a number");
    } else {
      if (item) {
        invoke("update", { data, item }).then(update);
        setError(null);
      } else {
        if (data.target.id === "input-expense-description")
          expenseDescriptionValue = data.target.value;
        if (data.target.id === "input-expense-amount")
          expenseAmountValue = data.target.value;
      }
    }
  };

  const inputRow = {
    cells: [
      {
        content: (
          <Textfield
            appearance="subtle"
            spacing="compact"
            id="input-expense-description"
            placeholder="Add an expense +"
            onBlur={validate}
          />
        ),
      },
      {
        content: (
          <Inline alignBlock="center">
            <Text>{currency}</Text>
            <Textfield
              appearance="subtle"
              spacing="compact"
              id="input-expense-amount"
              placeholder="0"
              onBlur={validate}
            />
          </Inline>
        ),
      },
      {
        content: (
          <Button
            appearance="subtle"
            spacing="compact"
            id="add-expense"
            onClick={create}
          >
            Add
          </Button>
        ),
      },
    ],
  };

  const fillTable = (expenses) => {
    if (expenses.length > 0) {
      const rows = expenses.map((item) => ({
        cells: [
          {
            content: (
              <Textfield
                appearance="subtle"
                spacing="compact"
                id="expense-description"
                defaultValue={item.description}
                onBlur={(event) => validate(event, item)}
              />
            ),
          },
          {
            content: (
              <Inline alignBlock="center">
                <Text>{currency}</Text>
                <Textfield
                  appearance="subtle"
                  spacing="compact"
                  id="expense-amount"
                  defaultValue={item.amount}
                  onBlur={(event) => validate(event, item)}
                />
              </Inline>
            ),
          },
          {
            content: (
              <Button
                appearance="subtle"
                iconBefore="trash"
                spacing="compact"
                onClick={() => invoke("delete", { item }).then(remove)}
              />
            ),
          },
        ],
      }));
      rows.push(inputRow);
      return rows;
    } else return [inputRow];
  };

  const getTotal = (expenses) => {
    let total = 0;
    expenses.forEach((expense) => {
      total += Number(expense.amount);
    });
    return total.toFixed(2);
  };

  return (
    <>
      <DynamicTable
        caption="Expenses"
        rows={expensesArray && fillTable(expensesArray)}
      />
      {error && (
        <Box xcss={errorStyle}>
          <Text>{error}</Text>
        </Box>
      )}
      <Inline spread="space-between">
        {expensesArray && (
          <Text>
            Total: {currency} {getTotal(expensesArray)}
          </Text>
        )}
        {expensesArray && (
          <Button onClick={() => invoke("delete-all").then(setExpensesArray)}>
            Delete All
          </Button>
        )}
      </Inline>
    </>
  );
};

ForgeReconciler.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
