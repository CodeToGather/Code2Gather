package db_seed

import (
	"encoding/json"
	"fmt"
	"github.com/google/uuid"
	"io/ioutil"
	"log"
	"os"

	"code2gather.com/room/src/models"
)

type QuestionSeed struct {
	Title         string `json:"title"`
	Difficulty    string `json:"difficulty"`
	DirectoryName string `json:"directory_name"`
}

var questionSeeds []*models.Question
var pwd string

func init() {
	path, err := os.Getwd()
	if err != nil {
		log.Println(err)
	}
	pwd = path
}

func GetSeedQuestions() []*models.Question {
	jsonFile, err := os.Open(getFilePathInQuestionSeedDir("questions.json"))
	if err != nil {
		fmt.Println(err)
		return questionSeeds
	}
	defer jsonFile.Close()
	fmt.Println("Successfully Opened questions.json")

	bytes, _ := ioutil.ReadAll(jsonFile)

	var questions []QuestionSeed

	err = json.Unmarshal(bytes, &questions)
	if err != nil {
		fmt.Println(err)
		return questionSeeds
	}

	for _, q := range questions {
		question, err := processQuestion(q)
		if err != nil {
			fmt.Println(err)
			return questionSeeds
		}
		questionSeeds = append(questionSeeds, question)
	}

	return questionSeeds
}

func processQuestion(seed QuestionSeed) (question *models.Question, err error) {
	fmt.Printf("Seeding Question %s (%s) \n", seed.Title, seed.Difficulty)

	textFileName := getFilePathInQuestionSeedDir(seed.DirectoryName + "/text.md")
	hintsFileName := getFilePathInQuestionSeedDir(seed.DirectoryName + "/hints.md")

	text, err := readFileAsString(textFileName)
	if err != nil {
		return
	}
	hints, err := readFileAsString(hintsFileName)
	if err != nil {
		return
	}

	question = &models.Question{
		Id:         uuid.New().String(),
		Title:      seed.Title,
		Text:       text,
		Difficulty: models.QuestionDifficulty(models.QuestionDifficulty_value[seed.Difficulty]),
		Hints:      hints,
	}
	return
}

func getFilePathInQuestionSeedDir(filename string) string {
	return pwd + SeedDataRelPath + QuestionSeedDirName + "/" + filename
}

func readFileAsString(filename string) (text string, err error) {
	bytes, err := ioutil.ReadFile(filename)
	if err != nil {
		return
	}
	text = string(bytes)
	return
}
