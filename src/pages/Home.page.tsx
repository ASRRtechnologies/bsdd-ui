import {ActionIcon, Card, Collapse, Container, Group, HoverCard, Indicator, Stack, Text, Tooltip} from "@mantine/core";
import React, {useEffect, useState} from "react";
import {IconCheck, IconInfoCircle, IconSearch} from "@tabler/icons-react";
import {ColorSchemeToggle} from '../components/ColorSchemeToggle/ColorSchemeToggle';

type IfcProductType = 'IfcProduct';
type IfcClassificationReferenceType = 'IfcClassificationReference';
type IfcClassificationType = 'IfcClassification';
type IfcMaterialType = 'IfcMaterial';

export interface IfcProduct {
    type: string;
    name: string;
    description: string;
    predefinedType: string;
    hasAssociations?: Association[];
}

export type Association = IfcClassificationReference | IfcMaterial;

export interface IfcClassificationReference {
    type: 'IfcClassificationReference';
    name: string;
    location: string;
    identification: string;
    referencedSource: IfcClassification;
}

interface IfcClassification {
    type: 'IfcClassification';
    name: string;
    location?: string;
}

interface IfcMaterial {
    type: 'IfcMaterial';
    name: string;
    description: string;
}

// response

export interface BuildingClass {
    uri: string;
    code: string;
    name: string;
    classType: string;
    referenceCode: string;
}

export interface BimBasisObjectsResponse {
    classes: BuildingClass[];
    classesTotalCount: number;
    classesOffset: number;
    classesCount: number;
    uri: string;
    name: string;
    version: string;
    organizationCodeOwner: string;
    organizationNameOwner: string;
    defaultLanguageCode: string;
    license: string;
    qualityAssuranceProcedure: string;
    status: string;
    releaseDate: string;
    lastUpdatedUtc: string;
}

const mockData: IfcProduct[] = [
    {
        "type": "IfcSlab",
        "name": "Floor: 23_FL_AT_breedplaatvloer_260 (C35/45)",
        "description": "breedplaatvloer",
        "predefinedType": "FLOOR",
        "hasAssociations": [
            {
                "type": "IfcClassificationReference",
                "name": "23.21 vloeren; constructief, vrijdragende vloeren",
                "location": "https://identifier.buildingsmart.org/uri/digibase/nlsfb/12.2021/class/23.21", // object url (detail)
                "identification": "23.21",
                "referencedSource": {
                    "type": "IfcClassification",
                    "name": "DigiBase Demo NL-SfB tabel 1",
                    "location": "https://identifier.buildingsmart.org/uri/digibase/nlsfb/12.2021" // domain
                }
            },
            {
                "type": "IfcMaterial",
                "name": "beton generiek",
                "description": "https://identifier.buildingsmart.org/uri/bimloket/naakt/0.1/class/betongeneriek"
            }
        ]
    },
    {
        "type": "IfcSlab",
        "name": "Floor: 23_FL_AT_breedplaatvloer_200 (C35/45)",
        "description": "breedplaatvloer 3",
        "predefinedType": "FLOOR"
    },
    {
        "type": "IfcSlab",
        "name": "Floor: 23_FL_AT_breedplaatvloer_200 (C35/45)",
        "description": "",
        "predefinedType": "FLOOR"
    },
    {
        "type": "IfcSlab",
        "name": "Floor: 23_FL_AT_breedplaatvloer_200 (C35/45)",
        "description": "breedplaatvloer",
        "predefinedType": "FLOOR"
    },
    {
        "type": "IfcSlab",
        "name": "Floor: 23_FL_AT_breedplaatvloer_200 (C35/45)",
        "description": "",
        "predefinedType": "FLOOR"
    },
    {
        "type": "IfcSlab",
        "name": "Floor: 23_FL_AT_breedplaatvloer_400 (C35/45) (oranje) dfsjaf;j;ajslf;jlfdsaj sdfajklfaljksjlkdf fsdalkfjsadljkfjlk aslkdjfjlkasdfljkadsjlk asfljkflsdjkljkafsd asdflkfsajkl",
        "description": "breedplaatvloer",
        "predefinedType": "FLOOR",
        "hasAssociations": [
            {
                "type": "IfcClassificationReference",
                "name": "23.21 vloeren; constructief, vrijdragende vloeren",
                "location": "https://identifier.buildingsmart.org/uri/digibase/nlsfb/12.2021/class/23.21",
                "identification": "23.21",
                "referencedSource": {
                    "type": "IfcClassification",
                    "name": "DigiBase Demo NL-SfB tabel 1",
                    "location": "https://identifier.buildingsmart.org/uri/digibase/nlsfb/12.2021"
                }
            },
            {
                "type": "IfcMaterial",
                "name": "beton generiek",
                "description": "https://identifier.buildingsmart.org/uri/bimloket/naakt/0.1/class/betongeneriek"
            }
        ]
    },
    {
        "type": "IfcSlab",
        "name": "Kanaalplaatvloer 200 VBI",
        "description": "kanaalplaatvloer",
        "predefinedType": "FLOOR"
    },
    {
        "type": "IfcSlab",
        "name": "Kanaalplaatvloer 200 VBI",
        "description": "kanaalplaatvloer",
        "predefinedType": "FLOOR"
    },
    {
        "type": "IfcDoor",
        "name": "Kegro Geïsoleerde voordeur 9155N",
        "description": "buitendeur",
        "predefinedType": "DOOR"
    }
]

function groupBy(array, property) {
    const grouped = array.reduce((acc, item) => {
        const key = item[property];

        if (!acc[key]) {
            acc[key] = [];
        }

        acc[key].push(item);
        return acc;
    }, {});

    // Sort the keys alphabetically and create a new sorted object
    return Object.keys(grouped).sort().reduce((acc, key) => {
        acc[key] = grouped[key];
        return acc;
    }, {});
}


export function BsddCard(props: { item: IfcProduct, class: any }) {
    let color = "blue"

    if (!props.class) color = "red"

    function determineColor(item: IfcProduct, found: any) {
        const ifcClassificatonReference = item.hasAssociations?.filter(it => it.type === "IfcClassificationReference")

        if (!ifcClassificatonReference) return "orange"

        for (let classRelation in found.classRelations) {
            // @ts-ignore
            console.log(classRelation.relatedClassUri, ifcClassificatonReference.location, classRelation.relatedClassUri === ifcClassificatonReference.location)
            // @ts-ignore
            if (classRelation.relatedClassUri === ifcClassificatonReference.location) return "green"
        }

        return "red"
    }

    if (props.class) color = determineColor(props.item, props.class)

    function truncateText(text: String, maxLength: number): String {
        if (text.length <= maxLength) return text
        return text.substring(0, maxLength) + "..."
    }

    return <Card key={props.item.name}>
        <Group align={"flex-start"} justify={"space-between"}>
            <Group my={"auto"}>
                <Indicator color={color} size={18} mx={"xs"}/>
                <Text>
                    <div>{truncateText(props.item.name, 50)}</div>
                </Text>
            </Group>

            <Group>

                <HoverCard>
                    <HoverCard.Target>
                        <Group>
                            <IconInfoCircle/>
                        </Group>
                    </HoverCard.Target>
                    <HoverCard.Dropdown>
                        {props.item.name}
                    </HoverCard.Dropdown>

                </HoverCard>
                <Tooltip label={"Select all instances"}>
                    <ActionIcon radius={"xl"}
                    color={"blue"}>
                        <IconSearch size={18}/>
                    </ActionIcon>
                </Tooltip>
                <Tooltip label={"Attach to type"}>
                    <ActionIcon radius={"xl"} color={"green"}>
                        <IconCheck size={18}/>
                    </ActionIcon>
                </Tooltip>
            </Group>


            {/*<pre>*/}
            {/*{JSON.stringify(props.class, null, 2)}*/}
            {/*</pre>*/}

            {/*<pre>*/}
            {/*{JSON.stringify(props.item, null, 2)}*/}
            {/*</pre>*/}
        </Group>
    </Card>
}

// function CategoryCollap2se(props: { category: string, opened: any, data: BimBasisObjectsResponse, items: any[] }) {
//
//     function determineBsddClass(item: IfcSlabType) {
//         // if none of the descriptions in data is the same as item.description, then color is red
//         // if description is present, orange
//
//         // if ifc type and predefined type are in the found data object, material is the same, nslsfb is the same
//         let found;
//
//         props.data?.classes.filter((dataItem: any) => {
//             if (dataItem.referenceCode === item.description) {
//                 found = dataItem
//             }
//         })
//
//
//         if (!found) return false
//
//         // let result = fetch(found.referenceCode.location)
//         //  console.log(result)
//
//         console.log(found, item)
//
//         return found
//     }
//
//     // fetch category uri
//
//     const {opened, category} = props;
//
//     return <Collapse in={!opened[category]}>
//         {/* Iterate over items for each category */}
//         {props.items.map((item) => {
//             return (
//                 <BsddCard item={item} class={determineBsddClass(item)} key={item.id}/>
//             );
//         })}
//     </Collapse>
// }

interface CategoryCollapseProps {
    category: string;
    opened: Record<string, boolean>;
    bbbr: BimBasisObjectsResponse;
    items: IfcProduct[];
}

function CategoryCollapse(props: CategoryCollapseProps) {
    const {category, opened, items} = props;
    const [isLoading, setIsLoading] = useState(true);
    const [data, setData] = useState<any>();
    const [error, setError] = useState(null);


    useEffect(() => {
        // Function to fetch data
        const fetchData = async () => {
            try {
                // Start by setting loading to true
                setIsLoading(true);

                const found = determineBsddClass(category, props.bbbr)

                if (found === false) return false
                // console.log(found)
                const encodedUri = encodeURIComponent(found.uri);
                const targetUrl = `https://bs-dd-api-prototype.azurewebsites.net/api/Class/v1?uri=${encodedUri}&includeClassProperties=true&includeChildClassReferences=true&includeClassRelations=true`;

                // Fetch data from the API
                const response = await fetch(targetUrl);


                // If the response is not ok, throw an error
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                // Parse the JSON data
                const result = await response.json();

                // console.log(result)

                // Update state with the fetched data
                setData(result);
            } catch (e) {
                // If an error occurred, set the error state
                setError(e.message);
            } finally {
                // Set loading to false when loading is complete
                setIsLoading(false);
            }
        };

        // Call the fetchData function
        fetchData();
    }, []); // The empty array ensures this effect runs only once after initial render

    if (isLoading) {
        return <div>Loading...</div>;
    }

    // If there was an error, show an error message
    if (error) {
        return <div>Error: {error}</div>;
    }

    function determineBsddClass(category: string, bbbr: BimBasisObjectsResponse) {
        // if none of the descriptions in data is the same as item.description, then color is red
        // if description is present, orange

        // if ifc type and predefined type are in the found data object, material is the same, nslsfb is the same
        let found;

        bbbr.classes.filter((dataItem: any) => {
            if (dataItem.code === category) {
                found = dataItem
            }
        })

        if (!found) return false

        return found
    }


    return (
        <Collapse in={!opened[category]}>
            {items.map((item, index) => {
                return (
                    <BsddCard item={item} class={data} key={index}/>
                );
            })}
        </Collapse>
    );
}


export function HomePage() {
    // State for the fetched data
    const [data, setData] = useState<BimBasisObjectsResponse>();
    // State to handle loading status
    const [isLoading, setIsLoading] = useState(true);
    // State to handle any errors
    const [error, setError] = useState(null);
    const [opened, setOpened] = useState({});

    const handleCollapseToggle = (category: string) => {
        setOpened((prevOpened) => ({
            ...prevOpened,
            [category]: !prevOpened[category]
        }));
    };

    useEffect(() => {
        // Function to fetch data
        const fetchData = async () => {
            try {
                // Start by setting loading to true
                setIsLoading(true);

                // Fetch data from the API
                const response = await fetch('https://bs-dd-api-prototype.azurewebsites.net/api/Dictionary/v1/Classes?Uri=https%3A%2F%2Fidentifier.buildingsmart.org%2Furi%2Fdigibase%2Fbim-basis-objecten%2F0.1');

                // If the response is not ok, throw an error
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                // Parse the JSON data
                const result = await response.json();

                // Update state with the fetched data
                setData(result);
            } catch (e) {
                // If an error occurred, set the error state
                setError(e.message);
            } finally {
                // Set loading to false when loading is complete
                setIsLoading(false);
            }
        };

        // Call the fetchData function
        fetchData();
    }, []); // The empty array ensures this effect runs only once after initial render

    // If still loading, show a loading message
    if (isLoading) {
        return <div>Loading...</div>;
    }

    // If there was an error, show an error message
    if (error) {
        return <div>Error: {error}</div>;
    }
    // Assuming you want to group by 'PredefinedType'
    const grouped = groupBy(mockData, 'description');


    return (
        <>
            <Container size={"40rem"}>
                <Stack gap={"xs"} pt={"md"}>
                    {/* Iterate over grouped object */}
                    {Object.entries(grouped).map(([category, items]) => (
                        <Stack key={category} gap={"xs"}>
                            <Text fw={600} fs={"xl"} style={{cursor: 'pointer'}}
                                  onClick={() => handleCollapseToggle(category)}>
                                {category.length > 0 ? `Description: ${category}` : 'No description'}
                            </Text>

                            {/*@ts-ignore*/}
                            <CategoryCollapse category={category} items={items} opened={opened} bbbr={data}/>
                        </Stack>
                    ))}
                </Stack>
            </Container>

            {/*<pre>*/}
            {/*    {JSON.stringify(data, null, 2)}*/}
            {/*</pre>*/}
            <ColorSchemeToggle/>
        </>
    );
}
