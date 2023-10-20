import { fakerPL } from '@faker-js/faker';
import { fakerTR } from '@faker-js/faker';
import { fakerKA_GE } from '@faker-js/faker';
import _ from 'lodash';

export default class UsersService {
  async getUsersRow(seed, pageNumber, count, region, errorCount) {
    const fakerSets = {
      PL: fakerPL,
      TR: fakerTR,
      KA_GE: fakerKA_GE,
    };
    const faker = fakerSets[region];
    faker.seed(parseInt(seed, 10) + parseInt(pageNumber, 10));
    const users = faker.helpers.multiple(
      () => {
        return {
          id: faker.string.uuid(),
          firstName: faker.person.firstName(),
          lastName: faker.person.lastName(),
          zipCode: faker.location.zipCode(),
          city: faker.location.city(),
          address: faker.location.streetAddress(),
        };
      },
      {
        count: parseInt(count, 10),
      }
    );
    errorCount = _.toNumber(errorCount);
    if (errorCount) {
      const usersWithError = await this.addError(users, errorCount, region);
      return usersWithError;
    }
    return users;
  }

  async addError(users, errorCount, region) {
    const funcsForError = [this.deleteChar, this.addChar, this.swapChar];
    const maximum = 3;
    const mediana = 2;
    const randomIndex = Math.floor(
      ((Math.random() * maximum) / mediana) * mediana
    );
    for (const user of users) {
      for (let i = 1; i <= Math.floor(errorCount); i++) {
        const randomUserProperty =
          _.keys(user)[_.random(0, _.keys(user).length - 1)];
        user[randomUserProperty] = await funcsForError[randomIndex](
          user[randomUserProperty],
          region
        );
      }
    }
    if (!Number.isInteger(errorCount)) {
      const userIndexForProbabilityError = await this.getRandomIndices(
        users.length,
        Math.round(
          10 * (errorCount - Math.floor(errorCount)) +
            Math.random() * 0.49 -
            0.25
        )
      );
      for (let el of userIndexForProbabilityError) {
        const user = users[el];
        const randomUserProperty =
          _.keys(user)[_.random(0, _.keys(user).length - 1)];
        user[randomUserProperty] = await funcsForError[randomIndex](
          user[randomUserProperty],
          region
        );
      }
    }
    return users;
  }

  async getRandomIndices(length, count) {
    const indices = new Set();
    while (indices.size < count) {
      const randomIndex = Math.floor(Math.random() * length);
      indices.add(randomIndex);
    }
    return Array.from(indices);
  }

  async deleteChar(randomUserProperty) {
    return _.replace(
      randomUserProperty,
      randomUserProperty[_.random(0, _.keys(randomUserProperty).length - 1)],
      ''
    );
  }

  async addChar(randomUserProperty, region) {
    const polishChars =
      'AĄBCĆDEĘFGHIJKLŁMNŃOÓPQRSŚTUVWXYZŹŻaąbcćdeęfghijklłmnńoópqrsśtuvwxyzźż0123456789';

    const turkishChars =
      'ABCÇDEFGĞHIİJKLMNOÖPRSŞTUÜVYZabcçdefgğhıijklmnoöprsştuüvyz0123456789';

    const georgianChars = 'აბგდევზთიკლმნოპჟრსტუფქღყშჩცძწჭხჯჰ0123456789';
    const charSets = {
      PL: polishChars,
      TR: turkishChars,
      KA_GE: georgianChars,
    };
    const chars = charSets[region];
    const posInProp = _.random(0, randomUserProperty.length - 1);
    const randomChar = chars.charAt(_.random(0, chars.length - 1));
    return (
      randomUserProperty.slice(0, posInProp + 1) +
      randomChar +
      randomUserProperty.slice(posInProp + 1)
    );
  }

  async swapChar(randomUserProperty) {
    const posInProp = _.random(0, randomUserProperty.length - 2);
    return (
      randomUserProperty.slice(0, posInProp) +
      randomUserProperty[posInProp + 1] +
      randomUserProperty.slice(posInProp + 1, posInProp + 1) +
      randomUserProperty[posInProp] +
      randomUserProperty.slice(posInProp + 1 + 1)
    );
  }
}
