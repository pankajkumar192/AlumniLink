const testFetch = async () => {
  try {
    const res = await fetch("http://localhost:5000/uploads/image-1777141312212-582416467.jpg");
    console.log("Status:", res.status);
  } catch (error) {
    console.error("Fetch error:", error);
  }
};
testFetch();
