import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  pdf,
  Font,
  Image,
  Svg,
  G,
  Path,
} from "@react-pdf/renderer";
import { ReviewStats } from "./types";

Font.register({
  family: "Google",
  src: "./google.ttf",
});
Font.registerEmojiSource({
  format: "png",
  url: "https://cdn.jsdelivr.net/gh/jdecked/twemoji@latest/assets/72x72/",
});

// Create styles
const stylesheet = StyleSheet.create({
  page: {
    fontFamily: "Google",
    flexDirection: "column",
    backgroundColor: "#fff",
    padding: 40,
    fontSize: 12,
  },
  header: {
    marginBottom: 10,
    display: "flex",
    flexDirection: "column",
    rowGap: 10,
    alignItems: "center",
    fontSize: 24,
  },
  section: {
    padding: 10,
    marginBottom: 10,
    display: "flex",
    flexDirection: "column",
    rowGap: 10,
  },
  line: {
    height: 1,
    backgroundColor: "#888",
  },
  title: {
    fontSize: 18,
    marginTop: 10,
  },
  ratingsContainer: {
    display: "flex",
    flexDirection: "row",
    columnGap: 50,
    rowGap: 20,
    flexWrap: "wrap",
  },
  bar: {
    height: 10,
    width: 130,
    backgroundColor: "#eee",
    borderRadius: 5,
    overflow: "hidden",
    marginTop: 5,
  },
  comment: {
    padding: 10,
    backgroundColor: "#eee",
    borderRadius: 10,
    borderTopLeftRadius: 0,
  },
});
const barColors = ["#00a63e", "#fdc700", "#e7000b"];

export const generatePDF = async (resumeReviews: ReviewStats) => {
  const { structure, clarity, formatting, relevance, wording } =
    resumeReviews._avg;

  const Pdf = ({ v }: { v: number }) => (
    <Document title="Resume review summary">
      <Page size="LETTER" style={stylesheet.page}>
        <View style={stylesheet.header}>
          <Svg width="64" viewBox="0 0 279.668 136.844">
            <G transform="translate(-161.22 -376.328)">
              <Path
                d="M553.281,447.24c-1.741-1.035-3.47-2.089-5.224-3.1q-19.773-11.433-39.549-22.861a21.663,21.663,0,0,1-10.869-15.456A22.263,22.263,0,0,1,514.5,380.14a22.023,22.023,0,0,1,16.659,2.592q14.682,8.474,29.353,16.969l42.42,24.528c2.508,1.45,5.122,2.746,7.5,4.385,7.08,4.878,10.555,11.709,9.916,20.29-.632,8.48-5.119,14.575-12.594,18.522-.249.131-.49.275-.735.413-.285-.078-.509.1-.751.185a23.588,23.588,0,0,1-7.711,1.535,23.178,23.178,0,0,1-12.13-3.256q-12.641-7.26-25.254-14.569C558.549,450.221,555.971,448.633,553.281,447.24Z"
                transform="translate(-179.531 -1.699)"
                fill="#0f9c58"
              />
              <Path
                d="M224.7,497.052a6.979,6.979,0,0,0,1.948,1.274q18.342,10.621,36.7,21.214c3.4,1.964,6.866,3.823,10.21,5.879A22.353,22.353,0,0,1,260.6,566.861a24.064,24.064,0,0,1-10.931-3.592c-7.923-4.625-15.884-9.185-23.825-13.777q-12.7-7.344-25.4-14.7c-9.357-5.41-18.749-10.762-28.066-16.239a21.554,21.554,0,0,1-11.041-17.135,22.141,22.141,0,0,1,12-22.094c.233-.121.456-.261.684-.392a5.222,5.222,0,0,0,.523-.17,22.214,22.214,0,0,1,12.265-1.635,23.059,23.059,0,0,1,8.41,3.029c9.681,5.6,19.32,11.264,29.071,16.736a.376.376,0,0,0,.41.165Z"
                transform="translate(0 -53.726)"
                fill="#4285f3"
              />
              <Path
                d="M237.131,443.171c-9.751-5.473-19.39-11.141-29.071-16.736a23.059,23.059,0,0,0-8.41-3.029,22.215,22.215,0,0,0-12.265,1.635,5.214,5.214,0,0,1-.523.17c-.4-.13-.8-.254-1.2-.392a3.36,3.36,0,0,1-.415-.224c2.04-1.181,4.012-2.327,5.989-3.467q17.188-9.91,34.379-19.817,16.884-9.725,33.772-19.441a53.691,53.691,0,0,1,7.953-4.2c12.956-4.807,27.578,3.813,29.587,17.46,1.438,9.767-2.949,18.441-11.728,23.443-9.934,5.661-19.821,11.405-29.73,17.111q-7.225,4.16-14.45,8.324a1.116,1.116,0,0,1-1.027.09,11.889,11.889,0,0,0-2.461-.773l.009.01C237.474,443.106,237.3,443.154,237.131,443.171Z"
                transform="translate(-12.836 0)"
                fill="#e94335"
              />
              <Path
                d="M553.225,524.928c2.69,1.392,5.268,2.98,7.889,4.494q12.625,7.288,25.254,14.569a23.179,23.179,0,0,0,12.13,3.256,23.587,23.587,0,0,0,7.711-1.535c.242-.089.466-.263.751-.185-1.468,1.03-3.064,1.845-4.611,2.74q-19.2,11.1-38.411,22.17-16.024,9.245-32.042,18.5a24.806,24.806,0,0,1-8.96,3.36,21.6,21.6,0,0,1-18.526-5.659,22.218,22.218,0,0,1-3.455-28.826,20.745,20.745,0,0,1,6.851-6.577c5.908-3.466,11.844-6.884,17.775-10.312q13.551-7.833,27.109-15.654C552.872,525.158,553.047,525.04,553.225,524.928Z"
                transform="translate(-179.476 -79.387)"
                fill="#fabb04"
              />
              <Path
                d="M296.641,519.821c.166-.017.344-.065.41.165A.376.376,0,0,1,296.641,519.821Z"
                transform="translate(-72.346 -76.65)"
                fill="#fefefe"
              />
            </G>
          </Svg>
          <Text>Resume Roast Summary</Text>
        </View>

        <View style={stylesheet.section}>
          <Text style={stylesheet.title}>{"⭐  Ratings"}</Text>
          <Text>
            Based on {resumeReviews._count.id} review
            {resumeReviews._count.id === 1 ? "" : "s"}
          </Text>
          <View style={stylesheet.ratingsContainer}>
            <View>
              <Text>Structure: {structure.toPrecision(2)}/5.0</Text>
              <View style={stylesheet.bar}>
                <View
                  style={[
                    {
                      height: 10,
                      width: `${(structure / 5) * 100}%`,
                      backgroundColor:
                        barColors[structure > 4 ? 0 : structure > 2.5 ? 1 : 2],
                    },
                  ]}
                />
              </View>
            </View>

            <View>
              <Text>Clarity: {clarity.toPrecision(2)}/5.0</Text>
              <View style={stylesheet.bar}>
                <View
                  style={[
                    {
                      height: 10,
                      width: `${(clarity / 5) * 100}%`,
                      backgroundColor:
                        barColors[clarity > 4 ? 0 : clarity > 2.5 ? 1 : 2],
                    },
                  ]}
                />
              </View>
            </View>

            <View>
              <Text>Formatting: {formatting.toPrecision(2)}/5.0</Text>
              <View style={stylesheet.bar}>
                <View
                  style={[
                    {
                      height: 10,
                      width: `${(formatting / 5) * 100}%`,
                      backgroundColor:
                        barColors[
                          formatting > 4 ? 0 : formatting > 2.5 ? 1 : 2
                        ],
                    },
                  ]}
                />
              </View>
            </View>

            <View>
              <Text>Relevance: {relevance.toPrecision(2)}/5.0</Text>
              <View style={stylesheet.bar}>
                <View
                  style={[
                    {
                      height: 10,
                      width: `${(relevance / 5) * 100}%`,
                      backgroundColor:
                        barColors[relevance > 4 ? 0 : relevance > 2.5 ? 1 : 2],
                    },
                  ]}
                />
              </View>
            </View>

            <View>
              <Text>Wording: {wording.toPrecision(2)}/5.0</Text>
              <View style={stylesheet.bar}>
                <View
                  style={[
                    {
                      height: 10,
                      width: `${(wording / 5) * 100}%`,
                      backgroundColor:
                        barColors[wording > 4 ? 0 : wording > 2.5 ? 1 : 2],
                    },
                  ]}
                />
              </View>
            </View>
            {/*  */}
          </View>
        </View>

        <View style={stylesheet.line}></View>
        <View style={stylesheet.section}>
          <Text style={stylesheet.title}>{"💬  Feedback comments"}</Text>
          {resumeReviews.comments.map((c, i) => (
            <View key={i} style={stylesheet.comment} wrap={false}>
              <Text>{c.trim()}</Text>
            </View>
          ))}
        </View>
      </Page>
    </Document>
  );
  const blob = await pdf(<Pdf v={Date.now()} />).toBlob();
  return URL.createObjectURL(blob);
};
