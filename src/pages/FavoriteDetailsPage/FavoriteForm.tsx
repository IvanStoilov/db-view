import React, { useEffect } from "react";
import { Favorite } from "../../model/Favorite";
import { Box, Button, Group, Select, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { produce } from "immer";

function FavoriteForm(props: {
  favorite: Favorite;
  onUpdate: (favoriteId: string, newData: Favorite) => void;
  onDelete: () => void;
}) {
  const form = useForm({
    initialValues: getValues(),
    validate: {
      name: (value) => (Boolean(value) ? null : "Empty"),
      user: (value) => (Boolean(value) ? null : "Empty"),
      password: (value) => (Boolean(value) ? null : "Empty"),
      host: (value) => (Boolean(value) ? null : "Empty"),
      database: (value) => (Boolean(value) ? null : "Empty"),
    },
  });

  useEffect(() => {
    form.setValues(getValues());
  }, [props.favorite]);

  return (
    <Box maw={300}>
      <form onSubmit={form.onSubmit(onSubmit)}>
        <TextInput withAsterisk label="Name" {...form.getInputProps("name")} />
        <TextInput
          withAsterisk
          mt="md"
          label="Host"
          {...form.getInputProps("host")}
        />
        <TextInput
          mt="md"
          withAsterisk
          label="User"
          {...form.getInputProps("user")}
        />
        <TextInput
          mt="md"
          withAsterisk
          type="password"
          label="Password"
          {...form.getInputProps("password")}
        />
        <TextInput
          mt="md"
          withAsterisk
          label="Database"
          {...form.getInputProps("database")}
        />
        <Select
          mt="md"
          label="Timezone"
          data={["UTC", "Europe/Madrid", "Europe/Sofia", "America/New_York"]}
          {...form.getInputProps("timezone")}
        ></Select>
        <Group position="left" mt="md">
          <Button type="submit">Submit</Button>
          <Button color="red" onClick={() => props.onDelete()}>
            Delete
          </Button>
        </Group>
      </form>
    </Box>
  );

  function getValues() {
    return {
      name: props.favorite.name,
      user: props.favorite.options.user,
      password: props.favorite.options.password,
      host: props.favorite.options.host,
      database: props.favorite.options.database,
      timezone: props.favorite.options.timezone,
    };
  }

  function onSubmit(values: typeof form.values) {
    props.onUpdate(
      props.favorite.id,
      produce(props.favorite, (draft) => {
        draft.name = values.name;
        draft.options.user = values.user;
        draft.options.password = values.password;
        draft.options.host = values.host;
        draft.options.database = values.database;
        draft.options.timezone = values.timezone;
      })
    );
  }
}

export default FavoriteForm;
