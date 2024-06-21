const { Stone } = require("../models/Stone");

async function getAll() {
  return Stone.find().lean();
}

async function getRecent() {
  return Stone.find().sort({ $natural: -1 }).limit(3).lean();
}

async function getById(id) {
  return Stone.findById(id).lean();
}

async function create(data, authorId) {
  const entry = new Stone({
    name: data.name,
    category: data.category,
    color: data.color,
    image: data.image,
    location: data.location,
    formula: data.formula,
    description: data.description,
    owner: authorId,
  });

  await entry.save();
  return entry;
}

async function update(id, data, userId) {
  const entry = await Stone.findById(id);

  if (!entry) {
    throw new ReferenceError("Entry not found" + id);
  }

  if (entry.owner.toString() !== userId) {
    throw new Error("Access Denied");
  }

  entry.name = data.name;
  entry.category = data.category;
  entry.color = data.color;
  entry.imag = data.image;
  entry.location = data.location;
  entry.formula = data.formula;
  entry.description = data.description;

  await entry.save();

  return entry;
}

async function like(stoneId, userId) {
  const entry = await Stone.findById(stoneId);

  if (!entry) {
    throw new ReferenceError("Entry not found" + stoneId);
  }

  if (entry.owner.toString() === userId) {
    throw new Error("Access Denied");
  }

  if (entry.likedList.find((like) => like.toString() === userId)) {
    return;
  }

  entry.likedList.push(userId);

  await entry.save();
}

async function deleteById(id, userId) {
  const entry = await Stone.findById(id);

  if (!entry) {
    throw new ReferenceError("Entry not found" + id);
  }

  if (entry.owner.toString() !== userId) {
    throw new Error("Access Denied");
  }

  await Stone.findByIdAndDelete(id);
}

module.exports = {
  getAll,
  getRecent,
  getById,
  create,
  update,
  deleteById,
  like,
};
