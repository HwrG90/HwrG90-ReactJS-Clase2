import { useForm } from "react-hook-form";
import { useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { dataBase } from "../../../src/services/firebase/index";
import {
  addDoc,
  collection,
  getDocs,
  query,
  where,
  documentId,
  writeBatch,
} from "firebase/firestore";
import CartContext from "../../context/CartContext";
import { Spinner } from "react-bootstrap";

const Formulario = () => {
  const navegacion = useNavigate();
  const { cart, borrarTodoCarrito } = useContext(CartContext);
  const [cargando, setCargando] = useState(false);
  const [nombre, setNombre] = useState();
  const [apellido, setApellido] = useState();
  const [telefono, setTelefono] = useState();
  const [mail, setMail] = useState();
  const [totalApagar, setTotal] = useState(0);

  useEffect(() => {
    calcularTotal2();
  }, [cart]);

  const calcularTotal2 = () => {
    let total = 0;
    cart.forEach((prod) => {
      total += prod.precio * prod.inicial;
    });
    setTotal(total);
  };

  const crearOrden = (e) => {
    e.preventDefault();
    setCargando(true);
    const ordenObjeto = {
      comprador: {
        nombre: nombre,
        apellido: apellido,
        email: mail,
        telefono: telefono,
      },
      producto: cart,
      total: totalApagar,
    };
    const ids = cart.map((prod) => prod.id);

    const batch = writeBatch(dataBase);

    const noHayStock = [];

    const collectionRef = collection(dataBase, "productos");

    getDocs(query(collectionRef, where(documentId(), "in", ids)))
      .then((respuesta) => {
        respuesta.docs.forEach((doc) => {
          const dataDoc = doc.data();
          const productosCantidad = cart.find(
            (prod) => prod.id === doc.id
          )?.inicial;

          if (dataDoc.stock >= productosCantidad) {
            batch.update(doc.ref, { stock: dataDoc.stock - productosCantidad });
          } else {
            noHayStock.push({ id: doc.id, ...dataDoc });
          }
        });
      })
      .then(() => {
        if (noHayStock.length === 0) {
          const collectionRef = collection(dataBase, "ordenes");
          return addDoc(collectionRef, ordenObjeto);
        } else {
          return Promise.reject({
            type: "no_hay_stock",
            productos: noHayStock,
          });
        }
      })
      .then(({ id }) => {
        alert(`Gracias por su compra ${nombre}, El numero de Orden es ${id}`);
        batch.commit();
        reset();
        borrarTodoCarrito();
        navegacion("/");
      })
      .catch((error) => {
        alert("Lo lamentamos", `No hay stock disponible`, "error");
        borrarTodoCarrito();
        navegacion("/");
      })
      .finally(() => {
        setCargando(false);
      });
  };

  const { register, handleSubmit, reset } = useForm();

  const onSubmit = (data) => {
    console.log(data);
    reset();
  };
  if (cargando) {
    return (
      <div className="spiner--grow">
        {" "}
        <Spinner animation="grow" role="status">
          <span className="visually-hidden"></span>
        </Spinner>
      </div>
    );
  }

  return (
    <div>
      <h2 className="titulo-form">
        Completar formulario para finalizar compra. Gracias!
      </h2>
      <div className="formulario--size">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div>
            <label>Nombre</label>
            <input
              className="form-control"
              type="text"
              name="nombre"
              placeholder="Nombre"
              {...register("nombre", { required: true, maxLength: 20 })}
              onChange={(e) => setNombre(e.target.value)}
            />
          </div>
          <div>
            <label>Apellido</label>
            <input
              className="form-control"
              type="text"
              name="apellido"
              placeholder="Apellido"
              {...register("apellido", { required: true, maxLength: 20 })}
              onChange={(e) => setApellido(e.target.value)}
            />
          </div>
          <div>
            <label>E-Mail</label>
            <input
              className="form-control"
              type="email"
              name="mail"
              placeholder="E-Mail"
              {...register("mail", { required: true, maxLength: 20 })}
              onChange={(e) => setMail(e.target.value)}
            />
          </div>
          <div>
            <label>Telefono</label>
            <input
              className="form-control"
              type="number"
              name="telefono"
              placeholder="Telefono"
              {...register("telefono", { required: true, maxLength: 20 })}
              onChange={(e) => setTelefono(e.target.value)}
            />
          </div>
          <button onClick={crearOrden} className="btn btn-info">
            Crear Orden
          </button>
        </form>
      </div>
    </div>
  );
};

export default Formulario;