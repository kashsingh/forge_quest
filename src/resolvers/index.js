import Resolver from "@forge/resolver";
import { storage } from "@forge/api";

const resolver = new Resolver();

const getUniqueId = () => "_" + Math.random().toString(36).substr(2, 9);

const getListKeyFromContext = (context) => {
  const { localId: id } = context;
  return id.split("/")[id.split("/").length - 1];
};

const getAll = async (listId) => {
  return (await storage.get(listId)) || [];
};

resolver.define("create", async (req) => {
  const listId = getListKeyFromContext(req.context);
  const records = await getAll(listId);
  const id = getUniqueId();

  const newRecord = {
    id: id,
    description: req.payload.expenseDescription,
    amount: req.payload.expenseAmount,
  };

  await storage.set(listId, [...records, newRecord]);
  return newRecord;
});

resolver.define("get-all", (req) => {
  return getAll(getListKeyFromContext(req.context));
});

resolver.define("update", async (req) => {
  let updatedRecord = req.payload.item;

  if (req.payload.data.target.id === "expense-description") {
    if (req.payload.data.target.value !== updatedRecord.description) {
      updatedRecord.description = req.payload.data.target.value;
    } else {
      return null;
    }
  }

  if (req.payload.data.target.id === "expense-amount") {
    if (req.payload.data.target.value !== updatedRecord.amount) {
      updatedRecord.amount = req.payload.data.target.value;
    } else {
      return null;
    }
  }

  const listId = getListKeyFromContext(req.context);
  const records = await getAll(listId);

  let finalRecords = records.map((item) => {
    if (item.id === updatedRecord.id) {
      return updatedRecord;
    }
    return item;
  });
  await storage.set(getListKeyFromContext(req.context), finalRecords);

  return updatedRecord;
});

resolver.define("delete", async (req) => {
  const listId = getListKeyFromContext(req.context);
  let records = await getAll(listId);

  records = records.filter((item) => item.id !== req.payload.item.id);

  await storage.set(getListKeyFromContext(req.context), records);

  return req.payload.item;
});

resolver.define("delete-all", async (req) => {
  await storage.set(getListKeyFromContext(req.context), []);
  return [];
});

export const handler = resolver.getDefinitions();
