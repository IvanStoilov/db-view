import { ErrorMessage, Field, Form, Formik } from "formik";
import React from "react";
import { Favorite } from "../../model/Favorite";

function FavoriteForm(props: { favorite: Favorite; onClose: () => void }) {
  return (
    <div>
      <Formik initialValues={props.favorite} onSubmit={handleSubmit}>
        <Form>
          <div className="field">
            <label htmlFor="formIdName" className="label">
              Name
            </label>
            <div className="control">
              <Field
                id="formIdName"
                type="text"
                name="name"
                className="input"
              />
            </div>
            <ErrorMessage name="name" component="div" />
          </div>

          <div className="field">
            <label htmlFor="formIdHost" className="label">
              Host
            </label>
            <div className="control">
              <Field
                id="formIdHost"
                type="text"
                name="host"
                className="input"
              />
            </div>
            <ErrorMessage name="host" component="div" />
          </div>

          <div className="field">
            <label htmlFor="formIduser" className="label">
              user
            </label>
            <div className="control">
              <Field
                id="formIduser"
                type="text"
                name="user"
                className="input"
              />
            </div>
            <ErrorMessage name="user" component="div" />
          </div>

          <div className="field">
            <label htmlFor="formIdpassword" className="label">
              password
            </label>
            <div className="control">
              <Field
                id="formIdpassword"
                type="text"
                name="password"
                className="input"
              />
            </div>
            <ErrorMessage name="password" component="div" />
          </div>

          <div className="field">
            <label htmlFor="formIddatabase" className="label">
              database
            </label>
            <div className="control">
              <Field
                id="formIddatabase"
                type="text"
                name="database"
                className="input"
              />
            </div>
            <ErrorMessage name="database" component="div" />
          </div>

          <div className="columns">
            <div className="column">
              <button className="button is-primary" type="submit">
                Submit
              </button>
            </div>
            <div className="column">
              <button className="button" onClick={() => props.onClose()}>
                Close
              </button>
            </div>
            <div className="column">
              <button className="button is-danger" onClick={onDelete}>
                Delete
              </button>
            </div>
          </div>
        </Form>
      </Formik>
    </div>
  );

  function handleSubmit(updatedFav: Favorite) {
    const favs: Favorite[] = JSON.parse(
      localStorage.getItem("favorites") || "[]"
    );
    const newFavs = favs.map((fav) =>
      fav.id === updatedFav.id ? updatedFav : fav
    );
    localStorage.setItem("favorites", JSON.stringify(newFavs));
    props.onClose();
  }

  function onDelete() {
    const favs: Favorite[] = JSON.parse(
      localStorage.getItem("favorites") || "[]"
    );
    const newFavs = favs.filter((fav) => fav.id !== props.favorite.id);
    localStorage.setItem("favorites", JSON.stringify(newFavs));
    props.onClose();
  }
}

export default FavoriteForm;
