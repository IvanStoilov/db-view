import { ErrorMessage, Field, Form, Formik } from "formik";
import React from "react";
import { Favorite } from "../../model/Favorite";

function FavoriteForm(props: {
  favorite: Favorite;
  onUpdate: (favoriteId: string, newData: Favorite) => void;
  onClose: () => void;
  onDelete: () => void;
}) {
  return (
    <div>
      <Formik
        initialValues={props.favorite}
        onSubmit={(fav) => props.onUpdate(fav.id, fav)}
        enableReinitialize={true}
      >
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
                name="options.host"
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
                name="options.user"
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
                name="options.password"
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
                name="options.database"
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
              <button
                className="button is-danger"
                onClick={() => props.onDelete()}
              >
                Delete
              </button>
            </div>
          </div>
        </Form>
      </Formik>
    </div>
  );
}

export default FavoriteForm;
