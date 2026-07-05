import { useEffect, useMemo, useState } from "react";
import {
  useController,
  type FieldValues,
  type UseControllerProps,
} from "react-hook-form";
import type { LocationIQSuggestion } from "../../../lib/types";
import {
  Box,
  debounce,
  List,
  ListItemButton,
  TextField,
  Typography,
} from "@mui/material";
import axios from "axios";

type LocationInputProps<T extends FieldValues> = {
  label: string;
} & UseControllerProps<T>;

export default function LocationInput<T extends FieldValues>(
  props: LocationInputProps<T>,
) {
  const { field, fieldState } = useController({ ...props });
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<LocationIQSuggestion[]>([]);
  const [inputValue, setInputValue] = useState(field.value || "");

  useEffect(() => {
    if (field.value && typeof field.value === "object") {
      setInputValue(field.value.venue || "");
    } else {
      setInputValue(field.value || "");
    }
  }, [field.value]);

  /**
   * This is why this is the last Udemy course I'm doing.
   * This would have been a perfect opportunity for the instructor to talk
   * about how you secure your API keys (e.g: create an API endpoint +
   * require the user to be logged in + rate limit their usage to prevent abuse).
   * Instead, he just plops it here, in plaintext...
   * I get that this key isn't super duper important in this dummy app
   * but cmon man.
   * But, haha, he pronounces "suggestion" in a funny way such a goofy fella!
   * I've diverged in previous Udemy courses and basically made them into
   * my own projects, but it's just not worth the effort anymore.
   */
  const locationURL = `https://api.locationiq.com/v1/autocomplete?key=${import.meta.env.VITE_LOCATIONIQ_API_KEY}&limit=5&dedupe=1&addressdetails=1&`;

  const fetchSuggestions = useMemo(
    () =>
      debounce(async (query: string) => {
        if (!query || query.length < 3) {
          setSuggestions([]);
          return;
        }

        // Also, might want to use Zod to verify the response, no?
        setLoading(true);
        try {
          const res = await axios.get<LocationIQSuggestion[]>(
            `${locationURL}q=${query}`,
          );

          setSuggestions(res.data);
        } catch (error) {
          console.log(error);
        } finally {
          setLoading(false);
        }
      }, 1000),
    [locationURL],
  );

  const handleChange = async (value: string) => {
    field.onChange(value);
    await fetchSuggestions(value);
  };

  const handleSelect = (location: LocationIQSuggestion) => {
    const city =
      location.address?.city ||
      location.address?.town ||
      location.address?.village;

    const venue = location.display_name;
    const latitude = location.lat;
    const longitude = location.lon;

    setInputValue(venue);
    field.onChange({ city, venue, latitude, longitude });
    setSuggestions([]);
  };

  return (
    <Box>
      <TextField
        {...props}
        {...field}
        fullWidth
        variant="outlined"
        value={inputValue}
        onChange={(e) => handleChange(e.target.value)}
        error={!!fieldState.error}
        helperText={fieldState.error?.message}
      />
      {loading && <Typography>Loading</Typography>}
      {suggestions.length > 0 && (
        <List sx={{ border: 1 }}>
          {suggestions.map((suggestion) => (
            <ListItemButton
              divider
              key={suggestion.place_id}
              onClick={() => {
                handleSelect(suggestion);
              }}
            >
              {suggestion.display_name}
            </ListItemButton>
          ))}
        </List>
      )}
    </Box>
  );
}
