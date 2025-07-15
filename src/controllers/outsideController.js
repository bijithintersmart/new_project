import axios from "axios";

export const getRandomUser = async (req, res) => {
  try {
    const response = await axios.get("https://randomuser.me/api");
    if (response.status == 200) {
      res.status(200).json(response.data);
    } else {
      res.status(404).json({ message: "Error Fetching from api." });
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Error while fetching user details form api.");
  }
};
export const getProductList = async (req, res) => {
  try {
    const response = await axios.get("https://fakestoreapi.com/products");
    if (response.status == 200) {
      res.status(200).json(response.data);
    } else {
      res.status(404).json({ message: "Error Fetching from api." });
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Error while fetching user details form api.");
  }
};
