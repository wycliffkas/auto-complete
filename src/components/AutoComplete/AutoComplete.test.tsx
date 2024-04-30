import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import AutoComplete from ".";

describe("AutoComplete", () => {
	it("displays loading when loading countries from API", async () => {
			render(<AutoComplete />);

		expect(screen.getByText("Loading...")).toBeInTheDocument();
		await waitFor(() => {
			expect(screen.queryByText("Loading...")).toBeNull();
		});
	});

	it("displays suggestions when input has text, after loading data from API", async () => {
		render(<AutoComplete />);
		await waitFor(() => {
			expect(screen.queryByText("Loading...")).toBeNull();
		});

		const input = screen.getByPlaceholderText("Type a country");
		userEvent.type(input, "uni");

		await waitFor(() => {
			expect(
				screen.getByText(
					(content, element) =>
						element?.textContent === "United States Minor Outlying Islands"
				)
			).toBeInTheDocument();
		});
	});

	it('displays "no results found" when user types "xxxx"', async () => {
		render(<AutoComplete />);
		await waitFor(() => {
			expect(screen.queryByText("Loading...")).toBeNull();
		});

		const input = screen.getByPlaceholderText("Type a country");
		userEvent.type(input, "xxxx");

		await waitFor(() => {
			expect(screen.getByText("No results found")).toBeInTheDocument();
		});
	});
});
