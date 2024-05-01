import { useEffect, useState, useCallback } from "react";

import "./styles.css";

interface Country {
	name: string;
}

const AutoComplete: React.FC = () => {
	const [countries, setCountries] = useState<Country[]>([]);
	const [inputText, setInputText] = useState<string>("");
	const [filteredSuggestions, setFilteredSuggestions] = useState<Country[]>([]);
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		const fetchCountries = async () => {
			try {
				setLoading(true);
				const response = await fetch(
					"https://countriesnow.space/api/v0.1/countries/capital"
				);
				if (!response.ok) {
					throw new Error("Failed to fetch countries");
				}
				setLoading(false);
				const data = await response.json();
				setCountries(data.data);
			} catch (error) {
				console.error("Error loading countries:", error);
				setLoading(false);
			}
		};
		fetchCountries();
	}, []);

	const handleInputChange = useCallback(
		(text: string) => {
			let matches: Country[] = [];
			if (text.length > 0) {
				matches = countries.filter((country) => {
					const regex = new RegExp(`${text}`, "gi");
					return country.name.match(regex);
				});
			}
			setFilteredSuggestions(matches);
			setInputText(text);
		},
		[countries]
	);

	const highlightMatchedText = (text: string, match: string) => {
		const parts = text.split(new RegExp(`(${match})`, "gi"));
		return parts.map((part, index) =>
			part.toLowerCase() === match.toLowerCase() ? (
				<span className="highlight" key={index}>
					{part}
				</span>
			) : (
				part
			)
		);
	};

	if (loading) {
		return <div>Loading...</div>;
	}

	return (
		<div>
			<input
				type="text"
				onChange={(e) => handleInputChange(e.target.value)}
				value={inputText}
				onBlur={() => {
					setTimeout(() => {
						setFilteredSuggestions([]);
					}, 100);
				}}
				placeholder="Type a country"
				aria-label="Type a country"
			/>

			{filteredSuggestions.length === 0 && inputText.length > 0 && (
				<div className="no-results">No results found</div>
			)}

			{filteredSuggestions.length > 0 &&
				filteredSuggestions.map((suggestion, index) => (
					<div className="dropdown" data-testid="dropdown" key={index}>
						{highlightMatchedText(suggestion.name, inputText)}
					</div>
				))}
		</div>
	);
};

export default AutoComplete;
