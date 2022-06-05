export const dogDocument = {
    data: {
        type: 'dogs',
        id: '1',
        attributes: {
            name: 'Rosie',
        },
    },
};

export const dogsDocument = {
    data: [
        {
            type: 'dogs',
            id: '1',
            attributes: {
                name: 'Rosie',
            },
        },
        {
            type: 'dogs',
            id: '2',
            attributes: {
                name: 'Wanda',
            },
        },
    ],
};

export const catWithFriendDocument = {
    data: {
        type: 'cats',
        id: '1',
        relationships: {
            friend: {
                data: { type: 'dogs', id: '1' },
            },
        },
    },
    included: [
        {
            type: 'dogs',
            id: '1',
            attributes: {
                name: 'Rosie',
            },
        },
    ],
};
