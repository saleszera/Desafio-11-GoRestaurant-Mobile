import { useNavigation, useRoute } from '@react-navigation/native';
import React, {
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useMemo,
  useState,
} from 'react';
import { Alert, Image } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';

import { ModalContext } from '../../contexts/ModalContext';
import api from '../../services/api';
import formatValue from '../../utils/formatValue';
import {
  AdditionalsContainer,
  AdittionalItem,
  AdittionalItemText,
  AdittionalQuantity,
  ButtonText,
  Container,
  FinishOrderButton,
  Food,
  FoodContent,
  FoodDescription,
  FoodImageContainer,
  FoodPricing,
  FoodsContainer,
  FoodTitle,
  Header,
  IconContainer,
  PriceButtonContainer,
  QuantityContainer,
  ScrollContainer,
  Title,
  TotalContainer,
  TotalPrice,
} from './styles';

interface Params {
  id: number;
}

interface Extra {
  id: number;
  name: string;
  value: number;
  quantity: number;
}

interface Food {
  id: number;
  name: string;
  description: string;
  price: number;
  image_url: string;
  thumbnail_url: string;
  formattedPrice: string;
  extras: Extra[];
}

const FoodDetails: React.FC = () => {
  const { showModalandClose } = useContext(ModalContext);

  const [food, setFood] = useState({} as Food);
  const [extras, setExtras] = useState<Extra[]>([]);
  const [isFavorite, setIsFavorite] = useState(false);
  const [foodQuantity, setFoodQuantity] = useState(1);

  const navigation = useNavigation();
  const route = useRoute();

  const routeParams = route.params as Params;

  useEffect(() => {
    async function loadFood(): Promise<void> {
      const response = await api.get(`/foods/${routeParams.id}`);

      const f = {
        ...response.data,
        formattedPrice: formatValue(response.data.price),
      };

      setFood(f);
      setExtras(
        f.extras.map((item: Extra) => ({
          ...item,
          quantity: 0,
        })),
      );
    }

    loadFood();
  }, [routeParams]);

  useEffect(() => {
    async function loadFavorites(): Promise<void> {
      const response = await api.get('/favorites');

      response.data.filter(
        (item: Food) => item.id === routeParams.id && setIsFavorite(true),
      );
    }

    loadFavorites();
  }, [routeParams.id]);

  function handleIncrementExtra(id: number): void {
    const incrementExtra = extras.map(extra =>
      extra.id === id ? { ...extra, quantity: extra.quantity + 1 } : extra,
    );

    setExtras(incrementExtra);
  }

  function handleDecrementExtra(id: number): void {
    const decrementExtra = extras.map(extra =>
      extra.id === id && extra.quantity !== 0
        ? { ...extra, quantity: extra.quantity - 1 }
        : extra,
    );

    setExtras(decrementExtra);
  }

  function handleIncrementFood(): void {
    setFoodQuantity(foodQuantity + 1);
  }

  function handleDecrementFood(): void {
    if (foodQuantity !== 1) {
      setFoodQuantity(foodQuantity - 1);
    }
  }

  const toggleFavorite = useCallback(() => {
    if (isFavorite) {
      api.delete(`/favorites/${food.id}`);
    } else {
      api.post('/favorites', food);
    }

    setIsFavorite(!isFavorite);
  }, [isFavorite, food]);

  const cartTotal = useMemo(() => {
    const totalExtra = extras.reduce((accumulator, extra) => {
      const subtotal = extra.quantity * extra.value;

      return accumulator + subtotal;
    }, 0);

    const total = food.price * foodQuantity + totalExtra;

    return formatValue(total);
  }, [extras, food, foodQuantity]);

  async function handleFinishOrder(): Promise<void> {
    try {
      await api.post('/orders', {
        product_id: food.id,
        name: food.name,
        description: food.description,
        price: food.price,
        thumbnail_url: food.thumbnail_url,
        extras: extras.map((extra: Extra) => ({
          id: extra.id,
          name: extra.name,
          value: extra.value,
          quantity: extra.quantity,
        })),
      });

      showModalandClose();

      setTimeout(() => {
        navigation.navigate('DashboardStack');
      }, 1000);
    } catch (error) {
      Alert.alert('Erro', 'Houve um erro ao fazer o pedido');
    }
  }

  // Calculate the correct icon name
  const favoriteIconName = useMemo(
    () => (isFavorite ? 'favorite' : 'favorite-border'),
    [isFavorite],
  );

  useLayoutEffect(() => {
    // Add the favorite icon on the right of the header bar
    navigation.setOptions({
      headerRight: () => (
        <MaterialIcon
          name={favoriteIconName}
          size={24}
          color="#FFB84D"
          onPress={() => toggleFavorite()}
        />
      ),
    });
  }, [navigation, favoriteIconName, toggleFavorite]);

  return (
    <Container>
      <Header />

      <ScrollContainer>
        <FoodsContainer>
          <Food>
            <FoodImageContainer>
              <Image
                style={{ width: 327, height: 183 }}
                source={{
                  uri: food.image_url,
                }}
              />
            </FoodImageContainer>
            <FoodContent>
              <FoodTitle>{food.name}</FoodTitle>
              <FoodDescription>{food.description}</FoodDescription>
              <FoodPricing>{food.formattedPrice}</FoodPricing>
            </FoodContent>
          </Food>
        </FoodsContainer>
        <AdditionalsContainer>
          <Title>Adicionais</Title>
          {extras.map(extra => (
            <AdittionalItem key={extra.id}>
              <AdittionalItemText>{extra.name}</AdittionalItemText>
              <AdittionalQuantity>
                <Icon
                  size={15}
                  color="#6C6C80"
                  name="minus"
                  onPress={() => handleDecrementExtra(extra.id)}
                  testID={`decrement-extra-${extra.id}`}
                />
                <AdittionalItemText testID={`extra-quantity-${extra.id}`}>
                  {extra.quantity}
                </AdittionalItemText>
                <Icon
                  size={15}
                  color="#6C6C80"
                  name="plus"
                  onPress={() => handleIncrementExtra(extra.id)}
                  testID={`increment-extra-${extra.id}`}
                />
              </AdittionalQuantity>
            </AdittionalItem>
          ))}
        </AdditionalsContainer>
        <TotalContainer>
          <Title>Total do pedido</Title>
          <PriceButtonContainer>
            <TotalPrice testID="cart-total">{cartTotal}</TotalPrice>
            <QuantityContainer>
              <Icon
                size={15}
                color="#6C6C80"
                name="minus"
                onPress={handleDecrementFood}
                testID="decrement-food"
              />
              <AdittionalItemText testID="food-quantity">
                {foodQuantity}
              </AdittionalItemText>
              <Icon
                size={15}
                color="#6C6C80"
                name="plus"
                onPress={handleIncrementFood}
                testID="increment-food"
              />
            </QuantityContainer>
          </PriceButtonContainer>

          <FinishOrderButton onPress={() => handleFinishOrder()}>
            <ButtonText>Confirmar pedido</ButtonText>
            <IconContainer>
              <Icon name="check-square" size={24} color="#fff" />
            </IconContainer>
          </FinishOrderButton>
        </TotalContainer>
      </ScrollContainer>
    </Container>
  );
};

export default FoodDetails;
