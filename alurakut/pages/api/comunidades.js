import { SiteClient } from 'datocms-client';

export default async function recebedorDeRequest(request, response) {

    if (request.method === 'POST') {

        const TOKEN = 'eabc7135d663a2ea7a55ad37d9ec84';

        const client = new SiteClient(TOKEN);

        const registroCriado = await client.items.create({
            itemType: "972906", // model ID
            ...request.body,
            /*
            title: 'Titulo Com',
            creatorSlug: 'EduardTeixeira',
            imageUrl: 'https://st.depositphotos.com/1780879/3816/i/600/depositphotos_38166573-stock-photo-trees-with-sunbeams.jpg',
            */
        })

        response.json({
            message: 'Dado criado dentro do Dato CMS',
            registroCriado: registroCriado,
        })

        return;
    }

    response.status(404).json({
        message : 'Ainda não temos nada no GET, mas temos o POST',
    })

}