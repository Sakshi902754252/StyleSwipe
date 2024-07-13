import random

class Recommender:
    def __init__(self):
        # In a real-world scenario, this would be a database of items
        self.items = [
            {"id": 1, "name": "Tops", "style": 0, "image_urls": [
                "https://www.myntra.com/tops/dressberry/dressberry-pink-floral-printed-square-neck-puff-sleeve-peplum-top/25014188/buy?utm_source=dms_google&utm_medium=pmax_cpc&utm_campaign=dms_google_pmax_cpc_Myntra_SOK_3P_Block2_New&keyword=&matchtype=&target=&placement=&gad_source=1&gclid=CjwKCAjwqMO0BhA8EiwAFTLgIO8_Gz7Ci-InlyWRXfNUgBIQPY9JCH_dwFSE1qmSCDL4j_zXa211HBoC5tkQAvD_BwE",
                "https://www.myntra.com/tops/mast+%26+harbour/mast--harbour-floral-printed-shoulder-strapped-peplum-top/24669982/buy?utm_source=dms_google&utm_medium=pmax_cpc&utm_campaign=dms_google_pmax_cpc_Myntra_SOK_3P_Block2_New&keyword=&matchtype=&target=&placement=&gad_source=1&gclid=CjwKCAjwqMO0BhA8EiwAFTLgIJRWXnv5LnIqv7ph-c0dTLkQGg6p8Th50FxJ75Kc2hlvGaB1_e8_QBoCFzoQAvD_BwE"
            ]},
            {"id": 2, "name": "Ethnic Wear", "style": 0, "image_urls": [
                "https://www.kalkifashion.com/in/red-floral-print-peplum-top-and-sharara-set.html?currency=INR&gad_source=1&gclid=CjwKCAjwqMO0BhA8EiwAFTLgIBrrAkfJ_Lifxim1c3CtAQh_J2rG_ffaoIsTqrnXTGW8eKvahgonXxoC8PsQAvD_BwE",
                "https://www.myntra.com/kurta-sets/kalini/kalini-ethnic-motifs-printed-pleated-mirror-work-empire-kurta-with-trousers--dupatta/29077390/buy?utm_source=dms_google&utm_medium=pmax_cpc&utm_campaign=dms_google_pmax_cpc_Myntra_SOK_3P_Block2_New&keyword=&matchtype=&target=&placement=&gad_source=1&gclid=CjwKCAjwqMO0BhA8EiwAFTLgICx8e904Y6CjARaLmxZDtwakC9HRNORZF0FnpPhyS244mOGbTR0OEBoCn9gQAvD_BwE"
            ]},
            {"id": 3, "name": "Jeans", "style": 1, "image_urls": [
                "https://www.myntra.com/jeans/roadster/the-roadster-lifestyle-co-women-wide-leg-high-rise-cargo-jeans/19759022/buy?utm_source=dms_google&utm_medium=pmax_cpc&utm_campaign=dms_google_pmax_cpc_Myntra_SOK_3P_Block2_New&keyword=&matchtype=&target=&placement=&gad_source=1&gclid=CjwKCAjwqMO0BhA8EiwAFTLgIHWE5FgwvxLt1ZZdJw51YEW7vHhAJnBJopPtNEVkg1QNAwMBImbMWhoCEZ0QAvD_BwE",
                "https://www.myntra.com/jeans/high+star/high-star-women-blue-high-rise-slash-knee-light-fade-jeans/23911874/buy?utm_source=dms_google&utm_medium=pmax_cpc&utm_campaign=dms_google_pmax_cpc_Myntra_SOK_3P_Block2_New&keyword=&matchtype=&target=&placement=&gad_source=1&gclid=CjwKCAjwqMO0BhA8EiwAFTLgIMD3IJaHM1D7kZHfx6qyAqcnPgJazdEDpijc6DzE92B7RJ_uWsWXkBoCJPMQAvD_BwE"
            ]},
            {"id": 4, "name": "Sarees", "style": 0, "image_urls": [
                "https://www.myntra.com/sarees/mitera/mitera-pink--white-ombre-pure-chiffon-saree/24218850/buy?utm_source=dms_google&utm_medium=pmax_cpc&utm_campaign=dms_google_pmax_cpc_Myntra_SOK_3P_Block2_New&keyword=&matchtype=&target=&placement=&gad_source=1&gclid=CjwKCAjwqMO0BhA8EiwAFTLgIN9oRIn0r104w4N1pUUSmCQLJ-5qFDp8XfnPjeJmcdr1GyoZqD0jdBoC-2MQAvD_BwE",
                "https://www.myntra.com/sarees/jinax/jinax-woven-design-zari-pure-silk-banarasi-saree/21332206/buy?utm_source=dms_google&utm_medium=pmax_cpc&utm_campaign=dms_google_pmax_cpc_Myntra_SOK_3P_Block2_New&keyword=&matchtype=&target=&placement=&gad_source=1&gclid=CjwKCAjwqMO0BhA8EiwAFTLgIHazTgGkcK8jno7_hUymQkKXM8YUvHVzeGdrbcWM--MPPpvRh0EYeBoC_zUQAvD_BwE"
            ]},
            {"id": 5, "name": "Shoes", "style": 1, "image_urls": [
                "https://www.myntra.com/heels/dressberry/dressberry-silver-toned-embellished-party-block-heels/24848120/buy?utm_source=dms_google&utm_medium=pmax_cpc&utm_campaign=dms_google_pmax_cpc_Myntra_SOK_3P_Block2_New&keyword=&matchtype=&target=&placement=&gad_source=1&gclid=CjwKCAjwqMO0BhA8EiwAFTLgIKTTy9TO9EhqiqrqvUCBFvMi0CFXAnfyAmCE2N-NXJrYBUQuTwx0qhoCZHIQAvD_BwE",
                "https://www.myntra.com/heels/sherrif+shoes/sherrif-shoes-embellished-party-block-heels-with-buckles/25080502/buy?utm_source=dms_google&utm_medium=pmax_cpc&utm_campaign=dms_google_pmax_cpc_Myntra_SOK_3P_Block2_New&keyword=&matchtype=&target=&placement=&gad_source=1&gclid=CjwKCAjwqMO0BhA8EiwAFTLgIEkDqSDE4OHq0TzOEOe-ond70MgTqN5CNjkjIYcArR_7YVpQiJo5TxoCh6oQAvD_BwE"
            ]},
        ]

    def get_recommendations(self, style, n=3):
        matching_items = [item for item in self.items if item["style"] == style]
        recommendations = random.sample(matching_items, min(n, len(matching_items)))

        # Prepare recommendations JSON with image_urls included
        recommendations_with_images = []
        for recommendation in recommendations:
            recommendations_with_images.append({
                'id': recommendation['id'],
                'name': recommendation['name'],
                'style': recommendation['style'],
                'image_urls': recommendation['image_urls']
            })

        return recommendations_with_images