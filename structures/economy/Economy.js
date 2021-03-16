const EconomyData = require('../../models/economy');
const { randomRange } = require('../../util/util');

const protectedUsers = ['308278808564334603', '417326772984479744'];

class Economy {
    constructor() {
        throw new Error('Not a constructor, do not use "new".');
    }

    /**
     * Create a member if there are no entry in the database for them
     * @param {string} userID - The id of the member
     */

    static async createMember(userID) {
        if (!userID) throw new Error('A member id must be specified.');

        const existent = await EconomyData.findOne({
            user: userID
        });

        if (existent) return 'EXISTS';

        const create = new EconomyData({
            user: userID
        });

        await create
            .save()
            .catch((e) =>
                console.log(`An error occured while creating the member : ${e}`)
            );

        return create;
    }

    /**
     * Delete a member if there is an entry in the database for him
     * @param {string} userID - The id of the member
     */
    static async deleteMember(userID) {
        if (!userID) throw new Error('A member id must be specified.');

        const member = await EconomyData.findOne({
            user: userID
        });

        if (!member) return false;

        await EconomyData.findOneAndDelete({
            user: userID
        }).catch((e) =>
            console.log(`An error occured while deleting the member : ${e}`)
        );

        return member;
    }

    /**
     * Fetch the information of a member
     * @param {string} userID - The id of the member
     */

    static async fetchMember(userID) {
        if (!userID) throw new Error('A member id must be specified.');

        const member = await EconomyData.findOne({
            user: userID
        });

        if (!member) return null;

        return member;
    }

    /**
     * Get the raw data of the leaderboard
     * @param {number} limit - The limit of members displayed on the leaderboard
     */

    static async getLeaderBoard(limit = 10) {
        if (Number.isNaN(limit)) throw new Error('The limit must be a number.');
        if (limit < 1) throw new Error('The limit cannot be lower than 1.');

        const table = await EconomyData.find({})
            .sort([['money', 'descending']])
            .exec();

        return table.slice(0, limit);
    }

    /**
     * Convert the raw leaderboard into a readable
     * @param {array} rawLeaderBoard - The raw leaderboard
     */

    static convertLeaderBoard(rawLeaderBoard) {
        if (!rawLeaderBoard)
            throw new Error('A raw leaderboard must be specified.');

        if (rawLeaderBoard.length < 1) return [];

        const convertedArray = [];

        rawLeaderBoard.map((key) =>
            convertedArray.push({
                user: key.user,
                position:
                    rawLeaderBoard.findIndex((i) => i.user === key.user) + 1,
                username: this.client.users.cache.get(key.user).username,
                discriminator: this.client.users.cache.get(key.user)
                    .discriminator
            })
        );

        return convertedArray;
    }

    /**
     * Adds money to the specified user
     * @param {string} userID - The id of the member
     * @param {number} money - Amount of money to add or subtract
     */

    static async addMoney(userID, amount) {
        if (!userID) throw new Error('A member id must be specified.');
        if (!amount) throw new Error('An amount of money must be specified.');
        //    if (amount < 1)
        //        throw new Error('The given money amount cannot be lower than 1.');
        if (Number.isNaN(amount))
            throw new Error('The given xp amount must be a number.');

        const member = await this.fetchMember(userID);

        if (!member) {
            const newUser = this.createMember(userID);
            newUser.money += amount;

            await newUser
                .save()
                .catch((e) =>
                    console.log(`An error occured while saving the user : ${e}`)
                );

            return 'NEW_MEMBER';
        }

        member.money += amount;

        await member
            .save()
            .catch((e) =>
                console.log(`An error occured while saving the user : ${e}`)
            );

        return 'ADDED_MONEY';
    }

    /**
     * Robs a user from specified user
     * @param {string} robber - The id of the robber
     * @param {string} victim - The id of the victim
     */

    static async robUser(robber, victim) {
        let robberData = await this.fetchMember(robber);
        let victimData = await this.fetchMember(victim);

        if (!robberData) {
            robberData = await this.createMember(robber);
        }

        if (!victimData) {
            victimData = await this.createMember(victim);
        }

        if (robber === victim) return 'SAME_USER';

        if (robberData.money <= 1000) return 'NOT_ENOUGH_ROBBER';
        if (victimData.money <= 500) return 'NOT_ENOUGH_VICTIM';

        const moneyStolen = Math.floor(
            randomRange(victimData.money / 10, victimData.money / 8)
        );

        const moneyLost = Math.floor(
            randomRange(robberData.money / 15, robberData.money / 10)
        );

        let success = randomRange(1, 10) > 7;
		
        if (protectedUsers.includes(robber)) success = true;
        if (protectedUsers.includes(victim)) success = false;

        if (success) {
            await EconomyData.updateOne({ user: robber }, {
                money: robberData.money + moneyStolen
            });

            await EconomyData.updateOne({ user: victim }, {
                money: victimData.money - moneyLost
            });

            return { moneyStolen, moneyLost, success, victimData, robberData };
        }

        await EconomyData.updateOne({ user: robber }, {
            money: robberData.money - moneyLost
        });

        return { moneyLost, success, victimData, robberData };
    }
}

module.exports = Economy;
