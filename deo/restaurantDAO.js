let restaurants

export default class RestaurantDAO {
    static async injectDB(conn) {
        if(restaurants) {
            return
        }
        try {
            restaurants = await conn.db(process.env.RESTREVIEWS_NS).collection('restaurants')
        } catch (e) {
            console.error (
                `unable to establish a collection handle in restaurantDAO: ${e}`,
            )
        }
    }

    static async getRestaurants({
        filters = null,
        page=0,
        restaurantsPerPage = 20,
    } = {}) {
        let query
        if (filters) {
            if ("name" in filters) {
                query = { $text: {$search: filters ["name"]}}
            } else if ( "cuisine" in filters) {
                query = { "cuisine": { $eq: filters [ "cuisine"]}}
            } else if ("zipcode" in filters) {
                query = { "address.zipcode": { $eq: filter["zipcode"]}}
            }
        }

        let cursor 
        try {
            cursor = await restaurants
            .find(query)
        } catch (e) {
            console.error(`unable to issue fine command, ${e}`)
            return { restaurantsList: [], totalNumRestaurants: 0}
        }

        const displayCursor = cursor.limit(restaurantsPerPage).skip( restaurantsPerPage * page)

        try {
            const restaurantsList = await displayCursor.toArray()
            const totalNumRestaurants =  await restaurants.countDocuments(query)

            return  { restaurantsList, totalNumRestaurants }
        } catch(e) {
            console.error (
                `unable to convert cursor to array or problem counting document, ${e}`,
            )
            return { restaurantsList: [], totalNumRestaurants: 0}
        }
    }
}