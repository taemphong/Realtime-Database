import { db } from "../firebase";
import { useState, useEffect } from "react";
import { collection, addDoc, getDocs, doc, deleteDoc, onSnapshot } from "firebase/firestore";

const FormInputData = () => {
  useEffect(() => {
    loadData();

    const unsubscribe = loadRealtime()
    return ()=>{
      unsubscribe();
    }
  }, []);
  

  const loadRealtime = () =>{
    const unsubscribe = onSnapshot(OrderRef,(snapshot)=>{
      const newData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setData(newData);
    })
    return ()=>{
      unsubscribe();
    }
  }

  const loadData = async () => {
    await getDocs(OrderRef)
      .then((query) => {
        const newData = query.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setData(newData);
      })
      .catch((err) => console.log(err));
  };

  const [form, setform] = useState({});
  const [data, setData] = useState([]);
  
  // console.log(data);


  const handleChange = (e) => {
    console.log("ก่อนอัปเดต:", form);
    console.log(e.target.name, e.target.value);
    setform({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleAddData = async () => {
    try {
      const result = await addDoc(OrderRef, form);
      console.log("result", result.id);
      loadData()
    } catch (err) {
      console.log(err);
    }
  };

  const deleteData = async(id) =>{
    console.log(id)
    try{
    await deleteDoc(doc(OrderRef,id))
    }catch(err){
      console.log(err)
    }
  }

  const OrderRef = collection(db,"Order")

  return (
    <div>
      <input
        onChange={(e) => handleChange(e)}
        type="text"
        name="name"
        placeholder="ชื่อ"
      />
      <br />
      <input
        onChange={(e) => handleChange(e)}
        type="text"
        name="detail"
        placeholder="รายละเอียด"
      />
      <br />
      <input
        onChange={(e) => handleChange(e)}
        type="number"
        name="price"
        placeholder="ราคา"
      />
      <br />
      <button onClick={handleAddData}>Add Data</button>
      <hr />
      <table className="table">
        <thead>
          <tr>
            <th scope="col">#</th>
            <th scope="col">Name</th>
            <th scope="col">Detail</th>
            <th scope="col">Price</th>
            <th scope="col">Action</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => (
            <tr key={index}>
              <th scope="row">{index+1}</th>
              <td>{item.name}</td>
              <td>{item.detail}</td>
              <td>{item.price}</td>
              <button onClick={()=>deleteData(item.id)}>ลบ</button>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default FormInputData;
