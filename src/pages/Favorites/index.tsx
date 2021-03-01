// import { useFocusEffect } from '@react-navigation/native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import React, { useCallback, useState } from 'react';
import { Image } from 'react-native';
import api from '../../services/api';
import formatValue from '../../utils/formatValue';
import {
  Container,
  Food,
  FoodContent,
  FoodDescription,
  FoodImageContainer,
  FoodList,
  FoodPricing,
  FoodsContainer,
  FoodTitle,
  Header,
  HeaderTitle,
} from './styles';

interface Food {
  id: number;
  name: string;
  description: string;
  price: number;
  thumbnail_url: string;
  formattedPrice: string;
}

const Favorites: React.FC = () => {
  const [favorites, setFavorites] = useState<Food[]>([]);
  const navigation = useNavigation();

  useFocusEffect(() => {
    async function loadFavorites(): Promise<void> {
      const response = await api.get('/favorites');

      setFavorites(
        response.data.map((food: Food) => ({
          ...food,
          formattedPrice: formatValue(food.price),
        })),
      );
    }

    loadFavorites();
  });

  const handleNavigateToOrders = useCallback(
    (id: number) => {
      navigation.navigate('FoodDetails', { id });
    },
    [navigation],
  );

  return (
    <Container>
      <Header>
        <HeaderTitle>Meus favoritos</HeaderTitle>
      </Header>

      <FoodsContainer>
        <FoodList
          data={favorites}
          keyExtractor={item => String(item.id)}
          renderItem={({ item }) => (
            <Food
              activeOpacity={0.6}
              onPress={() => handleNavigateToOrders(item.id)}
            >
              <FoodImageContainer>
                <Image
                  style={{ width: 88, height: 88 }}
                  source={{ uri: item.thumbnail_url }}
                />
              </FoodImageContainer>
              <FoodContent>
                <FoodTitle>{item.name}</FoodTitle>
                <FoodDescription>{item.description}</FoodDescription>
                <FoodPricing>{item.formattedPrice}</FoodPricing>
              </FoodContent>
            </Food>
          )}
        />
      </FoodsContainer>
    </Container>
  );
};

export default Favorites;
