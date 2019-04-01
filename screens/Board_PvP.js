import React, { Component } from "react";
import {
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  View,
  Alert,
  Button,
  TextInput,
  ImageBackground
} from "react-native";

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp
} from "react-native-responsive-screen";

import { MaterialCommunityIcons as Icon } from "react-native-vector-icons";
import { ResponsiveLayout } from "../ViewComponents/ResponsiveLayout";
import menu_background from "../assets/menu_background.jpg";

class Board extends React.Component {
  state = {
    board: [],
    gameState: [[0, 0, 0], [0, 0, 0], [0, 0, 0]],
    currentPlayer: 1,
    player1: "Mike",
    player2: "Ruslan",
    isValid: true,
    isWinner: false,
    isDrawOrWin: false,
    isLandscape: false,
    winnedGames: 0
  };

  initGame = () => {
    this.setState({
      gameState: [[0, 0, 0], [0, 0, 0], [0, 0, 0]],
      currentPlayer: 1
    });
  };

  getPlayerName = () =>
    this.state.currentPlayer === 1 ? this.state.player1 : this.state.player2;

  getWinner = () => {
    let win;
    let board = this.state.gameState;
    //rows validation
    for (let i = 0; i < 3; i++) {
      win = board[i][0] + board[i][1] + board[i][2];
      if (win === 3) return 1;
      else if (win === -3) return -1;
    }

    //columns validation
    for (let i = 0; i < 3; i++) {
      win = board[0][i] + board[1][i] + board[2][i];
      if (win === 3) return 1;
      else if (win === -3) return -1;
    }

    //diagonals validation
    win = board[0][0] + board[1][1] + board[2][2];
    if (win === 3) return 1;
    else if (win === -3) return -1;
    win = board[0][2] + board[1][1] + board[2][0];
    if (win === 3) return 1;
    else if (win === -3) return -1;

    return 0;
  };

  reloadGame = () => {
    this.initGame();
    this.setState({ isWinner: false, isDrawOrWin: false });
  };

  onPress = (row, col) => {
    let value = this.state.gameState[row][col];
    if (value !== 0) return;
    let currentPlayer = this.state.currentPlayer;
    let arr = this.state.gameState.slice();
    arr[row][col] = currentPlayer;
    this.setState({ gameState: arr });

    let nextPlayer = currentPlayer === 1 ? -1 : 1;
    this.setState({ currentPlayer: nextPlayer });

    let winner = this.getWinner();
    if (winner !== 0) {
      this.setState({ isWinner: true, isDrawOrWin: true });
    }
    this.isDrawOrWin(arr);
  };

  isWinner = () => {
    return (
      <View>
        <Text style={styles.player}>{this.getPlayerName()} wins!</Text>
      </View>
    );
  };

  renderSymbol = (row, col) => {
    let value = this.state.gameState[row][col];

    switch (value) {
      case 1:
        return <Icon name="close" style={styles.cross} />;
      case -1:
        return <Icon name="circle-outline" style={styles.circle} />;
      default:
        return null;
    }
  };

  componentDidMount() {
    this.initGame();
    Dimensions.addEventListener("change", () =>
      this.setState({
        isLandscape:
          Dimensions.get("window").height < Dimensions.get("window").width
      })
    );
  }

  hideReloadButton = () => {
    this.setState({ isDrawOrWin: true });
  };

  isDrawOrWin = array => {
    let count = 0;
    for (let i = 0; i < 3; i++)
      for (let j = 0; j < 3; j++) if (array[i][j] !== 0) count++;
    count === 9 && this.setState({ isDrawOrWin: true });
  };

  isValidInput = () => {
    return (
      this.state.player1 !== "" &&
      this.state.player2 !== "" &&
      this.state.player1 !== this.state.player2
    );
  };
  renderNamesInputs = () => (
    <ResponsiveLayout>
      <View>
        <View>
          <Text style={styles.player}> Player 1: </Text>
          <TextInput
            style={styles.input}
            onChangeText={player1 => this.setState({ player1 })}
            value={this.state.player1.trim()}
          />
          <Text style={[styles.player, { paddingTop: hp("3%") }]}>
            Player 2:
          </Text>
          <TextInput
            style={styles.input}
            onChangeText={player2 => this.setState({ player2 })}
            value={this.state.player2.trim()}
          />
        </View>
        <View style={styles.submit}>
          <Button
            disabled={!this.isValidInput()}
            color="#000"
            title="Submit"
            onPress={() => this.setState({ isValid: true })}
          />
        </View>
      </View>
    </ResponsiveLayout>
  );

  board = () => (
    <View>
      <View style={{ flexDirection: "row" }}>
        <TouchableOpacity
          onPress={() => this.onPress(0, 0)}
          style={[styles.cell, { borderLeftWidth: 0, borderTopWidth: 0 }]}
        >
          {this.renderSymbol(0, 0)}
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => this.onPress(0, 1)}
          style={[styles.cell, { borderTopWidth: 0 }]}
        >
          {this.renderSymbol(0, 1)}
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => this.onPress(0, 2)}
          style={[styles.cell, { borderRightWidth: 0, borderTopWidth: 0 }]}
        >
          {this.renderSymbol(0, 2)}
        </TouchableOpacity>
      </View>
      <View style={{ flexDirection: "row" }}>
        <TouchableOpacity
          onPress={() => this.onPress(1, 0)}
          style={[styles.cell, { borderLeftWidth: 0 }]}
        >
          {this.renderSymbol(1, 0)}
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => this.onPress(1, 1)}
          style={styles.cell}
        >
          {this.renderSymbol(1, 1)}
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => this.onPress(1, 2)}
          style={[styles.cell, { borderRightWidth: 0 }]}
        >
          {this.renderSymbol(1, 2)}
        </TouchableOpacity>
      </View>
      <View style={{ flexDirection: "row" }}>
        <TouchableOpacity
          onPress={() => this.onPress(2, 0)}
          style={[styles.cell, { borderLeftWidth: 0, borderBottomWidth: 0 }]}
        >
          {this.renderSymbol(2, 0)}
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => this.onPress(2, 1)}
          style={[styles.cell, { borderBottomWidth: 0 }]}
        >
          {this.renderSymbol(2, 1)}
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => this.onPress(2, 2)}
          style={[styles.cell, { borderBottomWidth: 0, borderRightWidth: 0 }]}
        >
          {this.renderSymbol(2, 2)}
        </TouchableOpacity>
      </View>
    </View>
  );

  landscapeMode = () => (
    <ImageBackground
      source={menu_background}
      style={{
        width: "100%",
        height: "100%",

        justifyContent: "center"
      }}
    >
      <View style={styles.landscapeContainer}>
        <View style={styles.scoreBoard}>
          <View style={{ flexDirection: "column" }}>
            <View
              style={{
                flexDirection: "column"
              }}
            >
              <Text style={styles.player}>
                <Icon name="close" style={{ fontSize: hp("5%") }} />
                {this.state.player1}: 7
              </Text>
              <Text style={styles.player}>
                <Icon name="circle-outline" style={{ fontSize: hp("4%") }} />
                {this.state.player2}: 5
              </Text>
            </View>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-around"
              }}
            >
              <Text style={styles.player}>Draws: 5</Text>
            </View>
          </View>
        </View>

        <View
          style={{
            flexDirection: "column",
            justifyContent: "space-around"
          }}
        >
          {this.state.isWinner ? this.isWinner() : this.board()}
          {this.state.isDrawOrWin && (
            <Button
              color="#000"
              title="Reload game"
              onPress={this.reloadGame}
            />
          )}
        </View>
        {this.state.isDrawOrWin ? null : (
          <View>
            <Text style={styles.player}>
              Current{"\n"}move:{"\n"}
            </Text>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-around"
              }}
            >
              <Text style={styles.player}>{this.getPlayerName()}</Text>
            </View>
          </View>
        )}
      </View>
    </ImageBackground>
  );

  render() {
    return (
      <>
        {this.state.isLandscape ? (
          this.state.isValid ? (
            this.landscapeMode()
          ) : (
            this.renderNamesInputs()
          )
        ) : (
          <>
            {this.state.isValid ? (
              <ResponsiveLayout>
                <View style={styles.scoreBoard}>
                  <View
                    style={{ flexDirection: "column", alignItems: "center" }}
                  >
                    <Text style={[styles.player, { marginBottom: "3%" }]}>
                      Wined games
                    </Text>
                    <View
                      style={{
                        flexDirection: "row",
                        justifyContent: "space-between"
                      }}
                    >
                      <Text style={[styles.player, { marginRight: "20%" }]}>
                        <Icon name="close" style={{ fontSize: hp("5%") }} />
                        {this.state.player1}: 7
                      </Text>
                      <Text style={styles.player}>
                        {" "}
                        <Icon
                          name="circle-outline"
                          style={{ fontSize: hp("4%") }}
                        />
                        {this.state.player2}: 5
                      </Text>
                    </View>
                    <View
                      style={{
                        flexDirection: "row",
                        justifyContent: "space-around"
                      }}
                    >
                      <Text style={styles.player}>Draws: 5</Text>
                    </View>
                  </View>
                </View>
                {this.state.isDrawOrWin ? null : (
                  <View>
                    <Text style={styles.player}>
                      Current move: {this.getPlayerName()}
                    </Text>
                  </View>
                )}

                {this.state.isWinner ? this.isWinner() : this.board()}
                {this.state.isDrawOrWin && (
                  <Button
                    color="#000"
                    title="Reload game"
                    onPress={this.reloadGame}
                  />
                )}
              </ResponsiveLayout>
            ) : (
              this.renderNamesInputs()
            )}
          </>
        )}
      </>
    );
  }
}

export default Board;

const styles = StyleSheet.create({
  scoreBoard: {
    flexDirection: "column",
    alignItems: "center"
  },
  cell: {
    borderWidth: 1.5,
    height: (Dimensions.get("window").height - hp("52%")) / 3,
    width: (Dimensions.get("window").width - wp("22%")) / 3,
    alignItems: "center",
    justifyContent: "center"
  },
  circle: {
    color: "black",
    fontSize: hp("12%"),
    alignItems: "center",
    justifyContent: "center"
  },
  cross: {
    color: "black",
    fontSize: hp("15%"),
    alignItems: "center",
    justifyContent: "center"
  },
  input: {
    height: hp("4%"),
    fontSize: hp("4%"),
    borderColor: "gray",
    borderBottomWidth: 1
  },
  submit: {
    paddingTop: hp("3%")
  },
  player: {
    fontSize: hp("5%")
  },
  landscapeContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around"
  }
});
